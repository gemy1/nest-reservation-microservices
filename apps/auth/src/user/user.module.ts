import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from '@app/common';
import { User, UserSchema } from './models/user.schema';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    DatabaseModule,
  ],
  providers: [UserService],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}
