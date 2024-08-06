import { Injectable, Pipe, PipeTransform } from "@angular/core";

import { errorConstants } from "../constants/error.constants";

@Pipe({ name: "tErrorCode" })
@Injectable({
  providedIn: "root",
})
export class ErrorUtils implements PipeTransform {
  transform(errorCode: string): string {
    if (errorCode)
      switch (errorCode) {
        case errorConstants.unauthorized: {
          errorCode = "Unauthorized";
          break;
        }
        case errorConstants.badRequest: {
          errorCode = "Bad Request";
          break;
        }
        case errorConstants.adminNotFound: {
          errorCode = "Admin not found";
          break;
        }
        case errorConstants.canNotDeleteThisAdmin: {
          errorCode = "Can not delete this admin";
          break;
        }
        case errorConstants.canNotUpdateRoleThisAdmin: {
          errorCode = "Can not update role this admin";
          break;
        }
        case errorConstants.locationNotFound: {
          errorCode = "location not found";
          break;
        }
        case errorConstants.usernameOrPasswordIsIncorrect: {
          errorCode = "Username or password is incorrect";
          break;
        }
        case errorConstants.roleNotFound: {
          errorCode = "Role not found";
          break;
        }
        case errorConstants.roleNameIsUnique: {
          errorCode = "Role name is unique";
          break;
        }
        case errorConstants.roleColorIsUnique: {
          errorCode = "Role color is unique";
          break;
        }
        case errorConstants.roleIsAlreadyInuse: {
          errorCode = "Role is already in use";
          break;
        }
        case errorConstants.canNotDeleteThisRole: {
          errorCode = "Can not delete this role";
          break;
        }
        case errorConstants.canNotUpdateThisRole: {
          errorCode = "Can not update this role";
          break;
        }
        case errorConstants.permissionNotFound: {
          errorCode = "Permission not found";
          break;
        }
        case errorConstants.categoryNotFound: {
          errorCode = "Category not found";
          break;
        }
        case errorConstants.canNotDeleteThisCategory: {
          errorCode = "Can not delete this category";
          break;
        }
        case errorConstants.canNotDeleteThisCategories: {
          errorCode = "Can not delete this categories";
          break;
        }
        case errorConstants.releaseDateGreaterThanPublishDate: {
          errorCode = "Release date grater than publish date";
          break;
        }
        case errorConstants.publishDateDateGreaterThanExpireDate: {
          errorCode = "Publish date greater than expire date";
          break;
        }
        case errorConstants.styleNotFound: {
          errorCode = "Style not found";
          break;
        }
        case errorConstants.styleNameIsUnique: {
          errorCode = "Style name is unique";
          break;
        }
        case errorConstants.styleSlugIsUnique: {
          errorCode = "Style slug is unique";
          break;
        }
        case errorConstants.styleIsAlreadyInUseAlbum: {
          errorCode = "Style is already in use album";
          break;
        }
        case errorConstants.styleIsAlreadyInUseArtist: {
          errorCode = "Style is already in use artist";
          break;
        }
        case errorConstants.albumNotFound: {
          errorCode = "Album not found";
          break;
        }
        case errorConstants.albumNameIsUnique: {
          errorCode = "Album name is unique";
          break;
        }
        case errorConstants.albumSlugIsUnique: {
          errorCode = "Album slug is unique";
          break;
        }
        case errorConstants.artistNotFound: {
          errorCode = "Artist not found";
          break;
        }
        case errorConstants.artistNameIsUnique: {
          errorCode = "Artist name is unique";
          break;
        }
        case errorConstants.artistSlugIsUnique: {
          errorCode = "Artist slug is unique";
          break;
        }
        case errorConstants.videoNotFound: {
          errorCode = "Video not found";
          break;
        }
        case errorConstants.videoNameIsUnique: {
          errorCode = "Video name is unique";
          break;
        }
        case errorConstants.videoNameAndAlbumAndArtistIsUnique: {
          errorCode = "Video name, album and artist is unique";
          break;
        }
        case errorConstants.videoSlugIsUnique: {
          errorCode = "Video slug is unique";
          break;
        }
        case errorConstants.videoSlugAndAlbumAndArtistIsUnique: {
          errorCode = "Video slug, album and artist is unique";
          break;
        }
        case errorConstants.contentNotFound: {
          errorCode = "Content not found";
          break;
        }
        case errorConstants.userNotFound: {
          errorCode = "User not found";
          break;
        }
        case errorConstants.userAlreadyExists: {
          errorCode = "User already exists";
          break;
        }
        case errorConstants.faceBookIsUnique: {
          errorCode = "Facebook is unique";
          break;
        }
        case errorConstants.googleIsUnique: {
          errorCode = "Google is unique";
          break;
        }
        case errorConstants.pleaseGotoLogin: {
          errorCode = "Please! go to login";
          break;
        }
        case errorConstants.pleaseGotoSignUp: {
          errorCode = "Please! go to signup";
          break;
        }
        case errorConstants.playlistmNotFound: {
          errorCode = "Playlist not found";
          break;
        }
        case errorConstants.playlistNameIsUnique: {
          errorCode = "Playlist name is unique";
          break;
        }
        case errorConstants.playlistSlugIsUnique: {
          errorCode = "Playlist slug is unique";
          break;
        }
        case errorConstants.ownerIsAlready: {
          errorCode = "owner is already";
          break;
        }
        default: {
          break;
        }
      }

    return errorCode;
  }
}
