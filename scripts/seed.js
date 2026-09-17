const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@fundsroom.com";

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (existingAdmin) {
    console.log("✅ Admin already exists.");
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  // Create admin
  await prisma.user.create({
    data: {
      fullName: "System Administrator",
      email: adminEmail,
      passwordHash: hashedPassword,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("🎉 Admin user created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });