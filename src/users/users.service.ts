import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { User } from './entities/user.entity';
import { hashPassword } from 'src/utils/bcrypt.util';
import { EMAIL_ALREADY_USED } from 'src/constant/error.constant';
import { v4 } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';
import { pagination } from 'src/utils/pagination';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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

  async update(userId: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({ userId }, updateUserDto);
  }
  //
  //  remove(id: number) {
  //    return `This action removes a #${id} user`;
  //  }
  async findAll(page: number, size: number,type : string ,name : string ) {
    return this.userRepository.find({...pagination(page, size)})
  }
  async 
}
