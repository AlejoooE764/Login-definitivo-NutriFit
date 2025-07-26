-- CreateTable
CREATE TABLE "AlimentacionPlan" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlimentacionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comida" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "hora" TEXT,
    "descripcion" TEXT NOT NULL,
    "planId" INTEGER NOT NULL,

    CONSTRAINT "Comida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" INTEGER NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trainerId" INTEGER,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roles" (
    "RolId" SERIAL NOT NULL,
    "Nombre" TEXT NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("RolId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Comida" ADD CONSTRAINT "Comida_planId_fkey" FOREIGN KEY ("planId") REFERENCES "AlimentacionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
