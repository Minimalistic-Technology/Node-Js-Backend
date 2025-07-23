import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CrmAuthUserModel } from '../models/authUserModel';
import { UserProfileModel } from '../models/userProfile';

export const signupUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstname, lastname, mobileNumber, email, password } = req.body;

    if (!firstname || !lastname || !mobileNumber || !email || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const existingUser = await CrmAuthUserModel.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new CrmAuthUserModel({
      firstname,
      lastname,
      mobileNumber,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // ✅ Automatically create the user profile
    const userProfile = new UserProfileModel({
      avatarUrl: 'https://example.com/default-avatar.png', // <-- default avatar URL
      fullName: `${firstname} ${lastname}`,
      role: 'User',
      location: 'India', // <-- default location
      social: {},
      personal: {
        firstName: firstname,
        lastName: lastname,
        email,
        phone: mobileNumber,
        bio: ''
      },
      address: {
        country: '',
        cityState: '',
        postalCode: '',
        taxId: ''
      }
    });

    await userProfile.save();

    res.status(201).json({ message: 'User created and profile saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await CrmAuthUserModel.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      'secret-key', // use env var in production
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
