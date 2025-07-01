
import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Achievement {
  id: number; // Changed from string to number to match database
  title: string;
  description: string;
  icon?: string;
  points?: number;
}

interface Quest {
  id: number; // Changed from string to number to match database
  title: string;
  description: string;
  target?: number;
  reward?: number;
  time_limit?: string | null;
}

const AdminAchievementsQuests: React.FC = () => {
  const { profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const [achievements, setAchievements] = React.useState<Achievement[]>([]);
  const [quests, setQuests] = React.useState<Quest[]>([]);
  const [newAchievement, setNewAchievement] = React.useState({ title: "", description: "" });
  const [newQuest, setNewQuest] = React.useState({ title: "", description: "" });
  const [loading, setLoading] = React.useState(false);
  const [editingAchievement, setEditingAchievement] = React.useState<number | null>(null);
  const [editingQuest, setEditingQuest] = React.useState<number | null>(null);
  const [editValues, setEditValues] = React.useState<{ title: string; description: string }>({ title: "", description: "" });

  // Fetch achievements and quests from Supabase
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: achievementsData } = await supabase.from("achievements").select("id, title, description");
      const { data: questsData } = await supabase.from("quests").select("id, title, description");
      setAchievements(achievementsData || []);
      setQuests(questsData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const addAchievement = async () => {
    if (!newAchievement.title.trim()) return;
    const { data, error } = await supabase.from("achievements").insert([{ title: newAchievement.title, description: newAchievement.description, icon: "star", points: 10 }]).select();
    if (!error && data) setAchievements((prev) => [...prev, ...data]);
    setNewAchievement({ title: "", description: "" });
  };

  const addQuest = async () => {
    if (!newQuest.title.trim()) return;
    const { data, error } = await supabase.from("quests").insert([{ title: newQuest.title, description: newQuest.description, target: 1, reward: 10 }]).select();
    if (!error && data) setQuests((prev) => [...prev, ...data]);
    setNewQuest({ title: "", description: "" });
  };

  const removeAchievement = async (id: number) => {
    const { error } = await supabase.from("achievements").delete().eq("id", id);
    if (!error) setAchievements((prev) => prev.filter((a) => a.id !== id));
  };

  const removeQuest = async (id: number) => {
    const { error } = await supabase.from("quests").delete().eq("id", id);
    if (!error) setQuests((prev) => prev.filter((q) => q.id !== id));
  };

  const startEditAchievement = (a: Achievement) => {
    setEditingAchievement(a.id);
    setEditValues({ title: a.title, description: a.description });
  };

  const startEditQuest = (q: Quest) => {
    setEditingQuest(q.id);
    setEditValues({ title: q.title, description: q.description });
  };

  const saveEditAchievement = async (id: number) => {
    if (!editValues.title.trim()) return;
    const { error } = await supabase.from("achievements").update({ title: editValues.title, description: editValues.description }).eq("id", id);
    if (!error) setAchievements((prev) => prev.map(a => a.id === id ? { ...a, ...editValues } : a));
    setEditingAchievement(null);
  };

  const saveEditQuest = async (id: number) => {
    if (!editValues.title.trim()) return;
    const { error } = await supabase.from("quests").update({ title: editValues.title, description: editValues.description }).eq("id", id);
    if (!error) setQuests((prev) => prev.map(q => q.id === id ? { ...q, ...editValues } : q));
    setEditingQuest(null);
  };

  if (!isAdmin) return null;

  return (
    <div className="bg-white border border-dusty-rose/20 rounded-2xl shadow-soft p-6 mb-12">
      <h3 className="text-lg font-serif font-semibold text-gentle-black mb-4">Administração de Conquistas e Missões</h3>
      {loading ? (
        <div className="text-soft-gray">A carregar conquistas e missões...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold mb-2">Conquistas</h4>
            <div className="flex gap-2 mb-2">
              <input
                className="border rounded px-2 py-1 flex-1"
                placeholder="Título"
                value={newAchievement.title}
                onChange={e => setNewAchievement(a => ({ ...a, title: e.target.value }))}
              />
              <input
                className="border rounded px-2 py-1 flex-1"
                placeholder="Descrição"
                value={newAchievement.description}
                onChange={e => setNewAchievement(a => ({ ...a, description: e.target.value }))}
              />
              <button onClick={addAchievement} className="px-3 py-1 bg-blue-500 text-white rounded">+</button>
            </div>
            <div className="space-y-2">
              {achievements.map(a => (
                <div key={a.id} className="flex items-center gap-2 p-2 border rounded">
                  {editingAchievement === a.id ? (
                    <>
                      <input
                        className="border rounded px-2 py-1 flex-1"
                        value={editValues.title}
                        onChange={e => setEditValues(v => ({ ...v, title: e.target.value }))}
                      />
                      <input
                        className="border rounded px-2 py-1 flex-1"
                        value={editValues.description}
                        onChange={e => setEditValues(v => ({ ...v, description: e.target.value }))}
                      />
                      <button onClick={() => saveEditAchievement(a.id)} className="px-2 py-1 bg-green-500 text-white rounded text-xs">✓</button>
                      <button onClick={() => setEditingAchievement(null)} className="px-2 py-1 bg-gray-500 text-white rounded text-xs">✗</button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className="font-medium">{a.title}</div>
                        <div className="text-sm text-gray-600">{a.description}</div>
                      </div>
                      <button onClick={() => startEditAchievement(a)} className="px-2 py-1 bg-yellow-500 text-white rounded text-xs">✏</button>
                      <button onClick={() => removeAchievement(a.id)} className="px-2 py-1 bg-red-500 text-white rounded text-xs">✗</button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-2">Missões</h4>
            <div className="flex gap-2 mb-2">
              <input
                className="border rounded px-2 py-1 flex-1"
                placeholder="Título"
                value={newQuest.title}
                onChange={e => setNewQuest(q => ({ ...q, title: e.target.value }))}
              />
              <input
                className="border rounded px-2 py-1 flex-1"
                placeholder="Descrição"
                value={newQuest.description}
                onChange={e => setNewQuest(q => ({ ...q, description: e.target.value }))}
              />
              <button onClick={addQuest} className="px-3 py-1 bg-blue-500 text-white rounded">+</button>
            </div>
            <div className="space-y-2">
              {quests.map(q => (
                <div key={q.id} className="flex items-center gap-2 p-2 border rounded">
                  {editingQuest === q.id ? (
                    <>
                      <input
                        className="border rounded px-2 py-1 flex-1"
                        value={editValues.title}
                        onChange={e => setEditValues(v => ({ ...v, title: e.target.value }))}
                      />
                      <input
                        className="border rounded px-2 py-1 flex-1"
                        value={editValues.description}
                        onChange={e => setEditValues(v => ({ ...v, description: e.target.value }))}
                      />
                      <button onClick={() => saveEditQuest(q.id)} className="px-2 py-1 bg-green-500 text-white rounded text-xs">✓</button>
                      <button onClick={() => setEditingQuest(null)} className="px-2 py-1 bg-gray-500 text-white rounded text-xs">✗</button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className="font-medium">{q.title}</div>
                        <div className="text-sm text-gray-600">{q.description}</div>
                      </div>
                      <button onClick={() => startEditQuest(q)} className="px-2 py-1 bg-yellow-500 text-white rounded text-xs">✏</button>
                      <button onClick={() => removeQuest(q.id)} className="px-2 py-1 bg-red-500 text-white rounded text-xs">✗</button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAchievementsQuests;
