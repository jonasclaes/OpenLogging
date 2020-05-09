export interface ILog {
    id: number | null;
    source_id: string | null;
    timestamp: number | null;
    category: string | null;
    message: string | null;
    save(): Promise<void>;
    delete(): Promise<void>;
}