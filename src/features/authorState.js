import { atom } from "recoil";

export const authorState = atom({
  key: "author",
  default: {
    profile: {
      username: "",
      bio: null,
      image: "https://api.realworld.io/images/smiley-cyrus.jpeg",
      following: false,
    },
  },
});
