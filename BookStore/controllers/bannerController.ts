import { Request, Response } from 'express';
import { Banner } from '../models/banner';

export class BannerController {
    // Get all banners
    static async getAllBanners(req: Request, res: Response): Promise<void> {
        try {
            const banners = await Banner.find();
            res.json(banners);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    // Get active banners (based on current time: 04:25 PM IST, July 11, 2025)
    static async getActiveBanners(req: Request, res: Response): Promise<void> {
        try {
            const now = new Date('2025-07-11T10:55:00Z'); // 04:25 PM IST = 10:55 UTC
            const activeBanners = await Banner.find({
                isActive: true,
                startTime: { $lte: now },
                endTime: { $gte: now }
            });
            res.json(activeBanners);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    // Get inactive banners (based on current time: 04:25 PM IST, July 11, 2025)
    static async getInactiveBanners(req: Request, res: Response): Promise<void> {
        try {
            const now = new Date('2025-07-11T10:55:00Z'); // 04:25 PM IST = 10:55 UTC
            const inactiveBanners = await Banner.find({
                $or: [
                    { isActive: false },
                    { startTime: { $gt: now } },
                    { endTime: { $lt: now } }
                ]
            });
            res.json(inactiveBanners);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    // Get single banner by ID
    static async getBannerById(req: Request, res: Response): Promise<void> {
        try {
            const banner = await Banner.findById(req.params.id);
            if (!banner) {
                res.status(404).json({ message: 'Banner not found' });
                return;
            }
            res.json(banner);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    // Create new banner
    static async createBanner(req: Request, res: Response): Promise<void> {
        try {
            const bannerData = {
                message: req.body.message,
                startTime: new Date(req.body.startTime),
                endTime: new Date(req.body.endTime),
                isActive: req.body.isActive !== undefined ? req.body.isActive : true
            };

            const banner = new Banner(bannerData);
            const newBanner = await banner.save();
            res.status(201).json(newBanner);
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }

    // Update banner
    static async updateBanner(req: Request, res: Response): Promise<void> {
        try {
            const banner = await Banner.findById(req.params.id);
            if (!banner) {
                res.status(404).json({ message: 'Banner not found' });
                return;
            }

            banner.message = req.body.message || banner.message;
            banner.startTime = req.body.startTime ? new Date(req.body.startTime) : banner.startTime;
            banner.endTime = req.body.endTime ? new Date(req.body.endTime) : banner.endTime;
            banner.isActive = req.body.isActive !== undefined ? req.body.isActive : banner.isActive;

            const updatedBanner = await banner.save();
            res.json(updatedBanner);
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }

    // Delete banner
    static async deleteBanner(req: Request, res: Response): Promise<void> {
        try {
            const banner = await Banner.findById(req.params.id);
            if (!banner) {
                res.status(404).json({ message: 'Banner not found' });
                return;
            }
            
            await banner.deleteOne();
            res.json({ message: 'Banner deleted' });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}