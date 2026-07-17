import settings from "../data/settings.json";
import { HomeClient } from "./home-client";

export default function Page() {
  return <HomeClient initialSettings={settings} />;
}
