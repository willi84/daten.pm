export type FILE_TREE = {
    [key: string]: {
        component: string;
        files: string[];
        folder: string[];
    };
};
