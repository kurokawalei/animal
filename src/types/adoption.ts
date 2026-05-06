export interface AnimalRecord {
  id: string;
  title: string;
  kind: string;
  variety: string;
  sex: string;
  bodyType: string;
  age: string;
  sterilization: string;
  bacterin: string;
  status: string;
  remark: string;
  caption: string;
  openDate: string;
  closeDate: string;
  updateDate: string;
  shelterName: string;
  shelterTel: string;
  shelterAddress: string;
  place: string;
  county: string;
  imageUrl: string;
  officialUrl: string;
}

export interface AdoptionFilters {
  county: string;
  kind: string;
  sex: string;
  bodyType: string;
  keyword: string;
}
