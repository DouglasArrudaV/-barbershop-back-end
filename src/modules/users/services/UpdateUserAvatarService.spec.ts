import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
    it('should be able to create a new user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const uptadeUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            password: '123456',
        })

        await uptadeUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        });
    
        expect(user.avatar).toBe('avatar.jpg');
    });

    it('should not be able to update avatar from non existing user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const uptadeUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);
    
        expect(uptadeUserAvatar.execute({
            user_id: 'non-existing-user',
            avatarFilename: 'avatar.jpg',
        }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should dele old avatar when updating new one', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const uptadeUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            password: '123456',
        })

        await uptadeUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        });

        await uptadeUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar2.jpg',
        });

        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
        expect(user.avatar).toBe('avatar2.jpg');
    });
});