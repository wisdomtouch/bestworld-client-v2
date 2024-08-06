export interface AboutUs {
  title: AboutDetail;
  content: AboutDetail;
  ourStory: AboutDetail;
  ourMission: AboutDetail;
  Partner: Partner[];
}

export interface AboutDetail {
  title: string;
  description: string;
  content: string;
}

export interface Partner {
  image: string;
}
