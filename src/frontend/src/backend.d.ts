import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ReadingHistory {
    mangaId: bigint;
    chapterNumber: bigint;
    timestamp: bigint;
}
export interface Manga {
    id: bigint;
    title: string;
    createdAt: bigint;
    description: string;
    coverImage: ExternalBlob;
    chapters: Array<Chapter>;
}
export interface Chapter {
    title: string;
    chapterNumber: bigint;
    images: Array<ExternalBlob>;
}
export interface UserProfile {
    username: string;
    email: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBookmark(mangaId: bigint): Promise<void>;
    addChapter(mangaId: bigint, title: string, images: Array<ExternalBlob>): Promise<void>;
    addManga(title: string, description: string, coverImage: ExternalBlob): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getBookmarks(): Promise<Array<Manga>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMangaById(mangaId: bigint): Promise<Manga>;
    getMangaList(page: bigint): Promise<Array<Manga>>;
    getReadingHistory(): Promise<Array<ReadingHistory>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    recordReadingHistory(mangaId: bigint, chapterNumber: bigint): Promise<void>;
    removeBookmark(mangaId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchManga(term: string): Promise<Array<Manga>>;
    updateManga(mangaId: bigint, title: string, description: string, coverImage: ExternalBlob): Promise<void>;
}
