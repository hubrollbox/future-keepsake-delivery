import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string;
  points?: number;
}
interface Quest {
  id: string;
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
  const [editingAchievement, setEditingAchievement] = React.useState<string | null>(null);
  const [editingQuest, setEditingQuest] = React.useState<string | null>(null);
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
  const removeAchievement = async (id: string) => {
    const { error } = await supabase.from("achievements").delete().eq("id", id);
    if (!error) setAchievements((prev) => prev.filter((a) => a.id !== id));
  };
  const removeQuest = async (id: string) => {
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
  const saveEditAchievement = async (id: string) => {
    if (!editValues.title.trim()) return;
    const { error } = await supabase.from("achievements").update({ title: editValues.title, description: editValues.description }).eq("id", id);
    if (!error) setAchievements((prev) => prev.map(a => a.id === id ? { ...a, ...editValues } : a));
    setEditingAchievement(null);
  };
  const saveEditQuest = async (id: string) => {
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
              <button className="bg-golden-honey px-3 py-1 rounded" onClick={addAchievement}>Adicionar</button>
            </div>
            <ul className="space-y-1">
              {achievements.map(a => (
                <li key={a.id} className="flex items-center gap-2">
                  {editingAchievement === a.id ? (
                    <>
                      <input className="border rounded px-2 py-1 flex-1" value={editValues.title} onChange={e => setEditValues(v => ({ ...v, title: e.target.value }))} placeholder="Título" title="Título da conquista" />
                      <input className="border rounded px-2 py-1 flex-1" value={editValues.description} onChange={e => setEditValues(v => ({ ...v, description: e.target.value }))} placeholder="Descrição" title="Descrição da conquista" />
                      <button className="text-sage-green" onClick={() => saveEditAchievement(a.id)}>Salvar</button>
                      <button className="text-soft-gray" onClick={() => setEditingAchievement(null)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <span className="font-medium">{a.title}</span>
                      <span className="text-xs text-soft-gray">{a.description}</span>
                      <button className="ml-auto text-sage-green" onClick={() => startEditAchievement(a)}>Editar</button>
                      <button className="ml-2 text-dusty-rose" onClick={() => removeAchievement(a.id)}>Remover</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
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
              <button className="bg-golden-honey px-3 py-1 rounded" onClick={addQuest}>Adicionar</button>
            </div>
            <ul className="space-y-1">
              {quests.map(q => (
                <li key={q.id} className="flex items-center gap-2">
                  {editingQuest === q.id ? (
                    <>
                      <input className="border rounded px-2 py-1 flex-1" value={editValues.title} onChange={e => setEditValues(v => ({ ...v, title: e.target.value }))} placeholder="Título" title="Título da missão" />
                      <input className="border rounded px-2 py-1 flex-1" value={editValues.description} onChange={e => setEditValues(v => ({ ...v, description: e.target.value }))} placeholder="Descrição" title="Descrição da missão" />
                      <button className="text-sage-green" onClick={() => saveEditQuest(q.id)}>Salvar</button>
                      <button className="text-soft-gray" onClick={() => setEditingQuest(null)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <span className="font-medium">{q.title}</span>
                      <span className="text-xs text-soft-gray">{q.description}</span>
                      <button className="ml-auto text-sage-green" onClick={() => startEditQuest(q)}>Editar</button>
                      <button className="ml-2 text-dusty-rose" onClick={() => removeQuest(q.id)}>Remover</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAchievementsQuests;
