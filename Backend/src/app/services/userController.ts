import { Request, Response } from "express";
import { CustomResponse, User, UserService } from "../interfaces/user";
import { UserModel } from "../models/user";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "../helpers/jwt";
import { Resend } from "resend";
import { CONFIG } from "../../config";

const resend = new Resend(CONFIG.resend.apiKey);

export type UserResponse = CustomResponse<User>;

export class UserController implements UserService<UserResponse> {
  public async create(req: Request, res: Response): Promise<UserResponse> {
    let {
      email,
      phone,
      password,
    }: { email: string; phone: string; password: string } = req.body;

    try {
      const find_email: User | null = await UserModel.findOne({ email });
      if (find_email) {
        return res
          .status(400)
          .json({ ok: false, error_message: "este correo ya esta registrado" });
      }

      const find_phone: User | null = await UserModel.findOne({ phone });
      if (find_phone) {
        return res.status(400).json({
          ok: false,
          error_message: "este numero de telefono ya esta registrado",
        });
      }

      const salt = bcrypt.genSaltSync(10);
      password = bcrypt.hashSync(password, salt);

      const verificationToken = crypto.randomBytes(32).toString("hex");

      const user: User = {
        name: req.body.name,
        email,
        phone,
        password,
        role: req.body.role || "client",
        isVerified: false,
        verificationToken,
      };

      const user_model = await UserModel.create({
        id: crypto.randomUUID(),
        ...user,
      });

      // Send verification email
      try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: "Verifica tu cuenta en ArteSano",
          html: `
            <h1>¡Bienvenido a ArteSano!</h1>
            <p>Por favor verifica tu correo electrónico haciendo clic en el siguiente enlace:</p>
            <a href="http://localhost:5173/verificar?token=${verificationToken}">Verificar mi cuenta</a>
          `,
        });
      } catch (emailError) {
        console.error("Error al enviar el correo de verificación", emailError);
        // We continue even if email fails, but it would be better to handle it.
      }

      const token = await generateToken(user_model.id);

      res.cookie('token', token, {
        httpOnly: true,    // 🔒 Clave: Hace que JavaScript no pueda leer el token
        secure: process.env.NODE_ENV === 'production',      // 🌐 Solo se envía a través de HTTPS (en producción)
        sameSite: 'strict',// 🛡️ Protege contra ataques CSRF
        maxAge: 24 * 60 * 60 * 1000 // Tiempo de vida (ej: 1 día)
      });

      return res.status(200).json({
        ok: true,
        message: "User created successfully",
        user: user_model,
      });
    } catch (error) {
      console.error("error al crear el usuario", error);
      return res
        .status(400)
        .json({ ok: false, error_message: "error al crear el usuario" });
    }
  }

  async login(
    req: Request,
    res: Response,
  ): Promise<CustomResponse<UserResponse>> {
    const { email, password } = req.body;
    try {
      const find_user = await UserModel.findOne({ email });
      if (!find_user) {
        return res
          .status(400)
          .json({ ok: false, error_message: "email no encontrado" });
      }

      const validPassword = bcrypt.compareSync(password, find_user.password);
      if (!validPassword) {
        return res
          .status(400)
          .json({ ok: false, error_message: "la contraseña no es valida" });
      }

      const token = await generateToken(find_user.id);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });

      return res
        .status(200)
        .json({ ok: true, message: "Login correcto", user: find_user });
    } catch (error) {
      console.error("error en el login", error);
      return res.status(400).json({
        ok: false,
        error_message: `error al intentar logearse ${error}`,
      });
    }
  }

  async getUserCredentials(
    req: Request,
    res: Response,
  ): Promise<Response<UserResponse> | any> {
    try {
      const uid = (req as any).uid;

      const find_user = await UserModel.findOne({ id: uid });

      if (!find_user) {
        return res
          .status(404)
          .json({ ok: false, error_message: "Usuario no encontrado" });
      }

      return res.status(200).json({
        ok: true,
        user: find_user,
      });
    } catch (error) {
      console.error("Error al obtener credenciales", error);
      return res.status(500).json({
        ok: false,
        error_message: "Error en el servidor al obtener el usuario",
      });
    }
  }

  async logout(req: Request, res: Response): Promise<Response<UserResponse> | any> {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      return res.status(200).json({ ok: true, message: "Logout correcto" });
    } catch (error) {
      return res.status(500).json({ ok: false, error_message: "Error al cerrar sesión" });
    }
  }

  public async update(req: Request, res: Response): Promise<UserResponse> {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      const user = await UserModel.findOne({ id });
      if (!user) {
        return res
          .status(404)
          .json({ ok: false, error_message: "Usuario no encontrado" });
      }

      if (updateData.email) {
        const emailExists = await UserModel.findOne({
          email: updateData.email,
          id: { $ne: id },
        });

        if (emailExists) {
          return res.status(400).json({
            ok: false,
            error_message: "este correo ya esta registrado",
          });
        }
      }

      if (updateData.phone) {
        const phoneExists = await UserModel.findOne({
          phone: updateData.phone,
          id: { $ne: id },
        });

        if (phoneExists) {
          return res.status(400).json({
            ok: false,
            error_message: "este numero de telefono ya esta registrado",
          });
        }
      }

      if (updateData.password) {
        const salt = bcrypt.genSaltSync(10);
        updateData.password = bcrypt.hashSync(updateData.password, salt);
      }

      delete updateData.id;
      delete updateData._id;
      delete updateData.__v;
      delete updateData.CreatedAt;
      delete updateData.UpdatedAt;

      const updatedUser = await UserModel.findOneAndUpdate(
        { id },
        { $set: { ...updateData, UpdatedAt: new Date() } },
        { new: true },
      );

      return res.status(200).json({
        ok: true,
        message: "User updated successfully",
        user: updatedUser as any,
      } as any);
    } catch (error) {
      console.error("error al actualizar el usuario", error);
      return res.status(500).json({
        ok: false,
        error_message: "Error al actualizar el usuario",
      } as any);
    }
  }

  public async delete(req: Request, res: Response): Promise<UserResponse> {
    try {
      const { id } = req.params;

      const deletedUser = await UserModel.findOneAndDelete({ id });

      if (!deletedUser) {
        return res
          .status(404)
          .json({ ok: false, error_message: "Usuario no encontrado" });
      }

      return res.status(200).json({
        ok: true,
        message: "User deleted successfully",
      } as any);
    } catch (error) {
      console.error("error al eliminar el usuario", error);
      return res.status(500).json({
        ok: false,
        error_message: "Error al eliminar el usuario",
      } as any);
    }
  }

  public async verifyEmail(req: Request, res: Response): Promise<Response<any> | any> {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({ ok: false, error_message: "Token requerido" });
      }

      const user = await UserModel.findOne({ verificationToken: token });

      if (!user) {
        return res.status(400).json({ ok: false, error_message: "Token inválido o expirado" });
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();

      return res.status(200).json({ ok: true, message: "Cuenta verificada exitosamente" });
    } catch (error) {
      console.error("Error al verificar correo", error);
      return res.status(500).json({ ok: false, error_message: "Error al verificar la cuenta" });
    }
  }

  public async forgotPassword(req: Request, res: Response): Promise<Response<any> | any> {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ ok: false, error_message: "El correo es requerido" });
      }

      const user = await UserModel.findOne({ email });

      if (!user) {
        // Por seguridad, no revelamos si el usuario existe o no
        return res.status(200).json({ ok: true, message: "Si el correo está registrado, recibirás un enlace de recuperación." });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora de validez
      await user.save();

      try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: "Recuperación de contraseña en ArteSano",
          html: `
            <h1>Recuperación de Contraseña</h1>
            <p>Has solicitado restablecer tu contraseña. Haz clic en el enlace de abajo para continuar:</p>
            <a href="http://localhost:5173/recuperar-contrasena?token=${resetToken}">Restablecer contraseña</a>
            <p>Si no fuiste tú, puedes ignorar este correo. El enlace expira en 1 hora.</p>
          `,
        });
      } catch (emailError) {
        console.error("Error al enviar el correo de recuperación", emailError);
        return res.status(500).json({ ok: false, error_message: "Error al enviar el correo" });
      }

      return res.status(200).json({ ok: true, message: "Si el correo está registrado, recibirás un enlace de recuperación." });
    } catch (error) {
      console.error("Error en forgotPassword", error);
      return res.status(500).json({ ok: false, error_message: "Error al procesar la solicitud" });
    }
  }

  public async resetPassword(req: Request, res: Response): Promise<Response<any> | any> {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ ok: false, error_message: "Token y nueva contraseña son requeridos" });
      }

      const user = await UserModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ ok: false, error_message: "El token es inválido o ha expirado" });
      }

      const salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(newPassword, salt);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res.status(200).json({ ok: true, message: "Contraseña actualizada exitosamente" });
    } catch (error) {
      console.error("Error en resetPassword", error);
      return res.status(500).json({ ok: false, error_message: "Error al restablecer la contraseña" });
    }
  }
}
