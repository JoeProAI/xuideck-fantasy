export type Manager = {
  id: string;
  name: string;
};

export type LeagueMember = {
  id: string;
  teamName: string;
  roster: string[];
};

export type FantasyLeague = {
  code: string;
  name: string;
  commissionerId: string;
  members: LeagueMember[];
  createdAt: number;
};
