import express, { Request } from 'express';
import { authenticate, validate } from '../../middlewares';
import {
  activateUser,
  avatarPost,
  checkToken,
  checkUserExists,
  userDeleteCurrent,
  userPost,
  userPutCurrent,
} from '../controllers/userController';
import multer, { FileFilterCallback } from 'multer';
import { updateSchema, userSchema } from '../../validators';

const fileFilter = (
  request: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (file.mimetype.includes('image')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ dest: './uploads/', fileFilter });

const router = express.Router();

router
  .route('/')
  .post(validate(userSchema), userPost)
  .put(authenticate, validate(updateSchema), userPutCurrent)
  .delete(authenticate, userDeleteCurrent);

router.route('/activate/:hash').get(activateUser);

router.route('/token').get(authenticate, checkToken);

router.route('/avatar').post(authenticate, upload.single('avatar'), avatarPost);

router.route('/available/:username').get(checkUserExists);

export default router;
