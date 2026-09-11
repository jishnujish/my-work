export type Player = {
  id: string;
  name: string;
  status?: string | null;
  captain_id?: string | null;
};

export type Captain = {
  id: string;
  name: string;
};

export type Teams = {
  [captainId: string]: Player[];
}