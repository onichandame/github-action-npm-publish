export declare const getEventFile: () => Promise<any>;
export declare const getMode: () => "all" | "at_least_one";
export declare const getPackages: () => string[] | null;
export declare const getRootPath: () => string;
export declare const run: (commandLine: string, args?: string[] | undefined, options?: import("@actions/exec").ExecOptions | undefined) => Promise<import("@actions/exec").ExecOutput>;
export declare const getPackagePaths: () => Promise<string[]>;
export declare const getPackageJson: (workspace?: string | undefined) => Promise<any>;
export declare const getTag: () => Promise<any>;
export declare const getYarnVersion: () => Promise<{
    major: string;
    minor: string;
    patch: string;
}>;
