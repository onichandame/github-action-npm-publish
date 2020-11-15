export declare const getMode: () => "all" | "at_least_one";
export declare const getWorkspaces: () => string[] | null;
export declare const getRootPath: () => string;
export declare const run: (commandLine: string, args?: string[] | undefined, options?: import("@actions/exec").ExecOptions | undefined) => Promise<number>;
export declare const findPath: (pattern: string) => Promise<string[]>;
export declare const getPackage: (workspace?: string | undefined) => Promise<any>;