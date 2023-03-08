import {ReadOnlyLanguage} from "../../models/common/language";
import {anyMatch} from "../array-utils";

export function languageInList(list: readonly ReadOnlyLanguage[], language: ReadOnlyLanguage) : boolean {
  return anyMatch(list, (lang) => lang.code === language.code)
}
