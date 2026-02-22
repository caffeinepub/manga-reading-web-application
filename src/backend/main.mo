import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Components
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Types
  type Chapter = {
    chapterNumber : Nat;
    title : Text;
    images : [Storage.ExternalBlob];
  };

  type Manga = {
    id : Nat;
    title : Text;
    description : Text;
    coverImage : Storage.ExternalBlob;
    chapters : [Chapter];
    createdAt : Int;
  };

  type ReadingHistory = {
    mangaId : Nat;
    chapterNumber : Nat;
    timestamp : Int;
  };

  type User = {
    principal : Principal;
    username : Text;
    email : Text;
    bookmarks : [Nat];
    readingHistory : [ReadingHistory];
    createdAt : Int;
  };

  public type UserProfile = {
    username : Text;
    email : Text;
  };

  // State
  let mangaMap = Map.empty<Nat, Manga>();
  let userMap = Map.empty<Principal, User>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextMangaId = 1;
  let chunkSize = 10;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Manga Management
  func assertMangaExists(mangaId : Nat) : Manga {
    switch (mangaMap.get(mangaId)) {
      case (null) { Runtime.trap("Manga not found") };
      case (?manga) { manga };
    };
  };

  public query ({ caller }) func getMangaList(page : Nat) : async [Manga] {
    let mangaIter = mangaMap.values();
    let mangaArray = mangaIter.toArray();
    let start = page * chunkSize;
    if (start >= mangaArray.size()) { return [] };
    let end = Nat.min(start + chunkSize, mangaArray.size());
    mangaArray.sliceToArray(start, end);
  };

  public query ({ caller }) func getMangaById(mangaId : Nat) : async Manga {
    assertMangaExists(mangaId);
  };

  public query ({ caller }) func searchManga(term : Text) : async [Manga] {
    mangaMap.values().toArray().filter(
      func(manga) {
        manga.title.contains(#text term) or manga.description.contains(#text term);
      }
    );
  };

  public shared ({ caller }) func addManga(title : Text, description : Text, coverImage : Storage.ExternalBlob) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add manga");
    };

    let id = nextMangaId;
    let manga : Manga = {
      id;
      title;
      description;
      coverImage;
      chapters = [];
      createdAt = Time.now();
    };
    mangaMap.add(id, manga);
    nextMangaId += 1;
    id;
  };

  public shared ({ caller }) func addChapter(mangaId : Nat, title : Text, images : [Storage.ExternalBlob]) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add chapters");
    };
    let manga = assertMangaExists(mangaId);

    let chapterNumber = manga.chapters.size() + 1;
    let newChapter : Chapter = {
      chapterNumber;
      title;
      images;
    };

    let newChapters = manga.chapters.concat([newChapter]);
    let updatedManga : Manga = {
      id = manga.id;
      title = manga.title;
      description = manga.description;
      coverImage = manga.coverImage;
      chapters = newChapters;
      createdAt = manga.createdAt;
    };

    mangaMap.add(mangaId, updatedManga);
  };

  public shared ({ caller }) func updateManga(mangaId : Nat, title : Text, description : Text, coverImage : Storage.ExternalBlob) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update manga");
    };
    let manga = assertMangaExists(mangaId);

    let updatedManga : Manga = {
      id = manga.id;
      title;
      description;
      coverImage;
      chapters = manga.chapters;
      createdAt = manga.createdAt;
    };

    mangaMap.add(mangaId, updatedManga);
  };

  // User Features
  func getUser(caller : Principal) : User {
    switch (userMap.get(caller)) {
      case (null) { Runtime.trap("User not found. Please register first."); };
      case (?user) { user };
    };
  };

  public shared ({ caller }) func addBookmark(mangaId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add bookmarks");
    };

    let user = getUser(caller);

    if (user.bookmarks.values().contains(mangaId)) { Runtime.trap("Bookmark already exists") };

    let newBookmarks = user.bookmarks.concat([mangaId]);
    let updatedUser : User = {
      principal = user.principal;
      username = user.username;
      email = user.email;
      bookmarks = newBookmarks;
      readingHistory = user.readingHistory;
      createdAt = user.createdAt;
    };

    userMap.add(caller, updatedUser);
  };

  public shared ({ caller }) func removeBookmark(mangaId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove bookmarks");
    };

    let user = getUser(caller);

    if (not user.bookmarks.values().contains(mangaId)) { Runtime.trap("Bookmark does not exist") };

    let newBookmarks = user.bookmarks.filter(func(b) { b != mangaId });
    let updatedUser : User = {
      principal = user.principal;
      username = user.username;
      email = user.email;
      bookmarks = newBookmarks;
      readingHistory = user.readingHistory;
      createdAt = user.createdAt;
    };

    userMap.add(caller, updatedUser);
  };

  func getBookmarkedMangas(bookmarks : [Nat]) : [Manga] {
    let bookmarkList = List.empty<Manga>();
    for (mangaId in bookmarks.values()) {
      switch (mangaMap.get(mangaId)) {
        case (null) {};
        case (?manga) { bookmarkList.add(manga) };
      };
    };
    bookmarkList.toArray();
  };

  public query ({ caller }) func getBookmarks() : async [Manga] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookmarks");
    };

    let user = getUser(caller);
    getBookmarkedMangas(user.bookmarks);
  };

  public shared ({ caller }) func recordReadingHistory(mangaId : Nat, chapterNumber : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record reading history");
    };

    let user = getUser(caller);

    let newEntry : ReadingHistory = {
      mangaId;
      chapterNumber;
      timestamp = Time.now();
    };

    let newHistory = user.readingHistory.concat([newEntry]);
    let updatedUser : User = {
      principal = user.principal;
      username = user.username;
      email = user.email;
      bookmarks = user.bookmarks;
      readingHistory = newHistory;
      createdAt = user.createdAt;
    };

    userMap.add(caller, updatedUser);
  };

  public query ({ caller }) func getReadingHistory() : async [ReadingHistory] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view reading history");
    };

    let user = getUser(caller);
    user.readingHistory;
  };
};
