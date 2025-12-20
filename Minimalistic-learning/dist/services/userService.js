import User from '../models/User';
export const findByEmail = (email) => User.findOne({ email });
export const findById = (id) => User.findById(id);
export const createUser = (payload) => User.create(payload);
export const updatePassword = async (user, password) => {
    user.password = password;
    return user.save();
};
export const toPublicUser = (user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    contactNumber: user.contactNumber,
    email: user.email,
    createdAt: user.createdAt
});
