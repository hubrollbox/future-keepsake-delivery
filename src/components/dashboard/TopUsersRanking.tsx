import React from "react";

interface UserRanking {
  user_id: string;
  name: string;
  count: number;
}

interface TopUsersRankingProps {
  users: UserRanking[];
}

const TopUsersRanking: React.FC<TopUsersRankingProps> = ({ users }) => {
  return (
    <div className="bg-white border border-dusty-rose/20 rounded-2xl shadow-soft p-6">
      <h3 className="text-lg font-serif font-semibold text-gentle-black mb-4">Ranking dos Usuários Mais Ativos</h3>
      <ol className="space-y-2">
        {users.map((user, idx) => (
          <li key={user.user_id} className="flex items-center gap-3">
            <span className="text-xl font-bold text-golden-honey">#{idx + 1}</span>
            <span className="font-medium text-gentle-black">{user.name || user.user_id.slice(0, 6) + '...'}</span>
            <span className="ml-auto text-soft-gray">{user.count} entregas</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default TopUsersRanking;
