import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'brayden.amb@gmail.com';
  
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    console.log(`User dengan email ${email} tidak ditemukan. Harap pastikan Anda sudah login setidaknya sekali di web tersebut menggunakan akun ini.`);
    return;
  }
  
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' }
  });
  
  console.log(`[SUKSES] Berhasil memperbarui peran untuk ${email} menjadi: ${updatedUser.role}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
