
import { Trophy, Medal, Award } from "lucide-react";
import type { TopUser } from "@/types/admin";

interface TopUsersRankingProps {
  users: TopUser[];
}

const TopUsersRanking = ({ users }: TopUsersRankingProps) => {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-keepla-red" />;
      case 1:
        return <Medal className="h-5 w-5 text-keepla-gray" />;
      case 2:
        return <Award className="h-5 w-5 text-keepla-gray" />;
      default:
        return (
          <div className="h-5 w-5 rounded-full bg-lavender-mist text-steel-blue text-xs flex items-center justify-center font-bold">
            {index + 1}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {users.length === 0 ? (
        <p className="text-misty-gray text-center py-8">Nenhum utilizador encontrado</p>
      ) : (
        users.map((user, index) => (
          <div key={user.id} className="flex items-center gap-4 p-3 rounded-xl bg-keepla-gray/40 hover:bg-keepla-gray/50 transition-colors">
            <div className="flex-shrink-0">
              {getRankIcon(index)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-keepla-gray-800 truncate">
                {user.full_name || user.email}
              </p>
              <p className="text-sm text-keepla-gray">
                {user.keepsakeCount} {user.keepsakeCount === 1 ? 'entrega' : 'entregas'}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="bg-keepla-gray/20 text-keepla-gray px-3 py-1 rounded-full text-sm font-semibold">
                #{index + 1}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TopUsersRanking;
