import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default (request: any, response: any, next: any) => {
  const auth = request.headers.authorization;

  if (!auth) return response.status(401).json({ message: "Not authorized without a token" });

  const parts = auth.split(' ');

//   if (!parts === 2) return response.status(401).json({ message: 'Token error' });

  const [format, token] = parts;

  if (!/^Bearer$/i.test(format)) return response.status(401).json({ message: 'Token is not formatted' });

  jwt.verify(token, String(process.env.SECRET), (error: any, decoded: any) => {
    if (error) return response.status(401).json({ message: "Invalid token" });

    request.usuarioId = decoded.id;
    request.headers.adm = decoded.adm;    

    return next();
  });
}