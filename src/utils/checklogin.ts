import { EKey } from "@/models/general";
import { NextResponse } from "next/server";

export function checkLogin() {
  const token = localStorage.getItem(EKey.TOKEN);
  if (token) {
    NextResponse.redirect("/login");
    return false;
  } else {
    return true;
  }
}
