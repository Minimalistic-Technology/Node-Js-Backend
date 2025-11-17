import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { gameConfigSchema, updateGameConfigSchema } from '../validation/gameConfigValidation';
import GameConfig from '../models/GameConfig';
import cloudinary from "../userUtils/cloudinaryClient";
import stream from "stream";


const uploadSingleToCloudinary = async (file?: Express.Multer.File) => {
  if (!file) return undefined;
  const result: any = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);
    bufferStream.pipe(uploadStream);
  });

  return {
    public_id: result.public_id,
    url: result.secure_url,
    type: result.resource_type,
    format: result.format,
  };
};


// --- Helper function to ensure only one config is active ---
const deactivateAllConfigs = async (excludeId: string | null = null) => {
  const filter = excludeId ? { _id: { $ne: excludeId } } : {};
  await GameConfig.updateMany(filter, { isActive: false });
};

/**
 * @desc    Create a new game config
 * @route   POST /api/v1/game-config
 */
export const createGameConfig = async (req: Request, res: Response) => {
  try {
    const validatedData = gameConfigSchema.parse(req.body);

    // LOGIC: If this new one is active, deactivate all others
    if (validatedData.isActive) {
      await deactivateAllConfigs();
    }

    const newConfig = new GameConfig(validatedData);
    await newConfig.save();
    
    res.status(201).json({
      message: 'Game configuration saved successfully!',
      config: newConfig
    });

  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Invalid data provided', errors: error.flatten().fieldErrors });
      return;
    }
    console.error('Error saving game config:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
};

/**
 * @desc    Get all game configs (light version)
 * @route   GET /api/v1/game-config
 */
export const getAllGameConfigs = async (req: Request, res: Response) => {
  try {
    // Only select key info for the list view
    const configs = await GameConfig.find({})
      .select('configName isActive createdAt updatedAt')
      .sort({ createdAt: -1 });
      
    res.status(200).json(configs);
  } catch (error) {
    console.error('Error fetching game configs:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
};

/**
 * @desc    Get a single game config by ID
 * @route   GET /api/v1/game-config/:id
 */
export const getGameConfigById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const config = await GameConfig.findById(id);

    if (!config) {
      res.status(404).json({ message: 'Configuration not found' });
      return;
    }

    res.status(200).json(config);
  } catch (error) {
    console.error('Error fetching game config:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
};

/**
 * @desc    Update a game config by ID
 * @route   PUT /api/v1/game-config/:id
 */
export const updateGameConfig = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateGameConfigSchema.parse(req.body);

    // LOGIC: If this one is being set to active, deactivate all others
    if (validatedData.isActive) {
      await deactivateAllConfigs(id);
    }
    
    const updatedConfig = await GameConfig.findByIdAndUpdate(id, validatedData, {
      new: true
    });

    if (!updatedConfig) {
      res.status(404).json({ message: 'Configuration not found' });
      return;
    }

    res.status(200).json({
      message: 'Configuration updated successfully',
      config: updatedConfig
    });

  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Invalid data provided', errors: error.flatten().fieldErrors });
      return;
    }
    console.error('Error updating game config:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
};

/**
 * @desc    Delete a game config by ID
 * @route   DELETE /api/v1/game-config/:id
 */
export const deleteGameConfig = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedConfig = await GameConfig.findByIdAndDelete(id);

    if (!deletedConfig) {
      res.status(4404).json({ message: 'Configuration not found' });
      return;
    }

    res.status(200).json({ message: 'Configuration deleted successfully' });
  } catch (error) {
    console.error('Error deleting game config:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
};

/**
 * @desc    Upload image for a single prize ladder level and save to media
 * @route   POST /api/v1/game-config/prize-ladder-image
 * @access  Admin (or whatever you use)
 */

export const updatePrizeLadderMedia = async (req: Request, res: Response) => {
  try {
    const { configId, prizeLadderId, giftDesc } = req.body;

    if (!configId || !prizeLadderId) {
      return res.status(400).json({
        message: "configId and prizeLadderId are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Image file is required",
      });
    }

    // 1) Upload to Cloudinary
    const media = await uploadSingleToCloudinary(req.file);

    if (!media) {
      return res.status(500).json({
        message: "Failed to upload image",
      });
    }

    // 2) Update type -> gift, set value -> giftDesc, set media
    const updatedConfig = await GameConfig.findOneAndUpdate(
      {
        _id: configId,
        "prizeLadder._id": prizeLadderId,
      },
      {
        $set: {
          "prizeLadder.$.type": "gift",
          "prizeLadder.$.value": giftDesc || "",
          "prizeLadder.$.media": media,
        },
      },
      { new: true }
    );

    if (!updatedConfig) {
      return res.status(404).json({
        message: "GameConfig or prize level not found",
      });
    }

    const updatedPrizeLevel = updatedConfig.prizeLadder.find(
      (pl: any) => pl._id.toString() === prizeLadderId
    );

    return res.status(200).json({
      message: "Gift image updated successfully",
      prizeLadderId: updatedPrizeLevel?._id,
      media: updatedPrizeLevel?.media,
      type: updatedPrizeLevel?.type,
      value: updatedPrizeLevel?.value,
    });
  } catch (error) {
    console.error("Error updating prize ladder media:", error);
    return res.status(500).json({
      message: "An internal server error occurred.",
    });
  }
};