export type Event = {
  event_date: string;
  id: number;
  name: string;
  location: string;
  lap_count: number;
  section_count: number;
  completed: 0 | 1;
};

export type InsertEvent = {
  event_date: string;
  event_name: string;
  event_location: string;
  lap_count: number;
  sections: number;
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

export type ResultsSummary = {
  class_name: string;
  rider_name: string;
  rider_number: string;
  total_score: string;
};
