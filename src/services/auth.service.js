const bcrypt = require("bcrypt");
const userRepository = require("../repositories/user.repository");
const { generateToken } = require("../utils/jwt");

const login = async (email, password) => {

    // Find user
    const user = await userRepository.findByEmail(email);

    if (!user) {
        throw new Error("Invalid email or password");
    }

    // Check if user is active
    if (!user.isActive) {
        throw new Error("User account is inactive");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    // Generate JWT
    const token = generateToken(user);

    return {
        token,
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        },
    };
};

module.exports = {
    login,
};