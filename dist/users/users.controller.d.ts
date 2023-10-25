import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getUsers(filter: any): Promise<{
        users: import("./users.model").Users[];
        documentsLength: number;
    }>;
    getSingleFreelancer(freelancerId: string): Promise<object>;
    changeUserData(body: any, userId: string): Promise<object>;
    subscribeUser(body: {
        id: string;
        value: boolean;
        email: string;
        subType: string;
        alertsQuery?: any;
    }, type: string): Promise<{
        [x: string]: any;
        [x: number]: any;
        [x: symbol]: any;
    }>;
    getBookmarks(userId: string): Promise<{
        jobs: any;
        freelancers: any;
    }>;
    deleteBookmarks(userId: string, data: {
        itemId: string;
        userEmail: string;
        type: 'jobs' | 'freelancers';
    }): Promise<{
        bookmarks: {
            jobs: any;
            freelancers: any;
        };
    }>;
    addBookmarks(userId: string, data: {
        itemId: string;
        userEmail: string;
        type: 'jobs' | 'freelancers';
    }): Promise<{
        bookmarks: {
            jobs: any;
            freelancers: any;
        };
    }>;
}
