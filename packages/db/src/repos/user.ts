import { prisma } from "../index";

export interface UserListItem {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
  disabled: boolean;
}

export const userRepo = {
  async list(): Promise<UserListItem[]> {
    return (await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        disabled: true,
      },
    })) as UserListItem[];
  },

  async setRole(id: string, role: UserListItem["role"]): Promise<void> {
    await prisma.user.update({ where: { id }, data: { role } });
  },

  async setDisabled(id: string, disabled: boolean): Promise<void> {
    await prisma.user.update({ where: { id }, data: { disabled } });
  },
};
