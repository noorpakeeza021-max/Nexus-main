import { v4 as uuidv4 } from 'uuid';

export const users = new Map();

export const createUser = (userData) => {
  const user = {
    id: uuidv4(),
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users.set(user.id, user);
  return user;
};

export const findUserById = (id) => users.get(id);

export const findUserByEmail = (email) => {
  for (const user of users.values()) {
    if (user.email === email) return user;
  }
  return null;
};

export const updateUser = (id, updates) => {
  const user = users.get(id);
  if (!user) return null;
  const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
  users.set(id, updatedUser);
  return updatedUser;
};

export const deleteUser = (id) => users.delete(id);

export const getAllUsers = () => Array.from(users.values());

export const seedUsers = () => {
  const defaultUsers = [
    { name: 'John Entrepreneur', email: 'john@startup.com', password: ' hashed', role: 'entrepreneur', company: 'TechStartup', bio: 'Building the next big thing' },
    { name: 'Sarah Investor', email: 'sarah@fund.com', password: 'hashed', role: 'investor', company: 'Venture Capital', bio: 'Looking for great startups' },
    { name: 'Mike Wilson', email: 'mike@company.com', password: 'hashed', role: 'entrepreneur', company: 'Innovation Labs', bio: 'AI and ML solutions' },
  ];
  defaultUsers.forEach(createUser);
};