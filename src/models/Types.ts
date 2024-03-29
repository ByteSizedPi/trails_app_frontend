export type Event = {
  event_date: string;
  id: number;
  name: string;
  location: string;
};

export type Sections = { sections: number[] };

export type Rider = {
  class: string;
  rider_name: string;
  rider_number: number;
};

export type Score = {
  lap_number: number;
  score: number;
};
