import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { User } from './entities/user.entity';
import { hashPassword, verifyPassword } from 'src/utils/bcrypt.util';
import { EMAIL_ALREADY_USED } from 'src/constant/error.constant';
import { v4 } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';
import { pagination } from 'src/utils/pagination';
import { Like } from 'typeorm';
import { NotiStatus, OnlineStatus } from 'src/constant/constant';
import { NotificationEntity } from 'src/notifications/entities/notification.entity';
import { CloudinaryService } from 'nestjs-cloudinary';
import { Friend } from 'src/friends/entities/friend.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createUser(createUserDto: SignUpDto) {
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new BadRequestException({ ...EMAIL_ALREADY_USED });
    }

    const otp = v4();
    const password = await hashPassword(createUserDto.password);
    const user = this.userRepository.create({
      ...createUserDto,
      onlineStatus: OnlineStatus.OFF,
      password,
      otp,
    });
    return this.userRepository.save(user);
  }

  async findOne(email: string) {
    const user = await this.userRepository.findOneBy({
      email,
    });
    return user;
  }

  async updatePassword(userId : number, password : string){
    const newPassword = await hashPassword(password);
    return this.userRepository.update(userId,{password : newPassword});
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({userId}, updateUserDto);
  }

  async findAll(
    page: number,
    size: number,
    type: string,
    name: string = '',
    userId: number,
  ) {
    if (type === 'all') {
      const all = await this.userRepository
        .createQueryBuilder('user')
        .where('user.firstName ILIKE :name', { name: `%${name}%` })
        .orWhere('user.lastName ILIKE :name', { name: `%${name}%` })
        .take(size)
        .skip((page - 1) * size)
        .getMany();
      const list = all.filter((user) => user.userId !== userId);
      return list;
    } else {
      return this.userRepository
        .createQueryBuilder('user')
        .select()
        .leftJoin(
          'friend',
          'friend',
          'friend.senderId = user.userId OR friend.receiverId = user.userId',
        )
        .where('user.userId = :userId', { userId: userId })
        .andWhere('(user.firstName LIKE :name OR user.lastName LIKE :name)', {
          name: `%${name}%`,
        })
        .take(size)
        .skip((page - 1) * size)
        .getMany();
    }
  }
  async getUserById(userId: number) {
    return await this.userRepository.findOneBy({ userId });
  }

  async changeStatusUser(userId: number, status: OnlineStatus) {
    return await this.userRepository.update(userId, { onlineStatus: status });
  }

  async getNotification(userId: number) {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.notifications', 'notification-entity')
      .select()
      .where('"userUserId" = :userId AND status = :status', {
        userId: userId,
        status: NotiStatus.NOT_READ_YET,
      })
      .getOne();
  }
  async uploadAvatar(file: Express.Multer.File, userId: number) {
    const image = await this.cloudinaryService.uploadFile(file);
    const user = await this.getUserById(userId);
    return await this.userRepository.update(user, { avatar: image.public_id });
  }

  async uploadFile(file: Express.Multer.File){
    const uploadFile = await this.cloudinaryService.uploadFile(file);
    return uploadFile.public_id;
  }
  async getAvatarUrl(userId: number) {
    const user = await this.getUserById(userId);
    const image = await this.cloudinaryService.cloudinary.api.resource(
      user.avatar,
    );
    return image.secure_url;
  }
}
