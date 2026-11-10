import type { Request, Response } from 'express';
import { UsuarioModel } from '../Models/usuario.model';

export const login = (req: Request, res: Response) => {
  const { usuario, contrasena } = req.body ?? {};
  if (!usuario || !contrasena) {
    res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    return;
  }
  UsuarioModel.obtenerPorUsername(String(usuario))
    .then((user) => {
      if (!user || !UsuarioModel.verificar(String(contrasena), user.password)) {
        res.status(401).json({ error: 'Credenciales inválidas' });
        return;
      }
      res.json({ success: true, usuario: { username: user.username, nombre: user.nombre, rol: user.rol } });
    })
    .catch(() => res.status(500).json({ error: 'Error al iniciar sesión' }));
};
