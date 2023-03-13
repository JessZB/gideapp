import bcrypt from "bcryptjs";

export const encryptText = async (plainText) => {
  if (typeof plainText === "number"){
  const hash = await bcrypt.hash(plainText.toString(), 10);
  return hash;
  }else {
    const hash = await bcrypt.hash(plainText, 10);
    return hash;
  }
};

export const compareText = async (plainText, hashPassword) => {
  if (typeof plainText === "number")
    return await bcrypt.compare(plainText.toString(), hashPassword);
  else {
    return await bcrypt.compare(plainText, hashPassword);
  }
};
