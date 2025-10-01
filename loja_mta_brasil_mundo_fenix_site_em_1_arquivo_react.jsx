import React, { useMemo, useState } from "react";
import { ShoppingCart, Search, Trash2, Plus, Minus, Menu, ChevronRight, CheckCircle2, Gamepad2, PackageSearch, Truck, Shield, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// =========================================
// Loja MTA – Brasil Mundo Fênix
// Single-file React component (Tailwind + shadcn/ui)
// Foco: venda de itens e serviços apenas para MTA
// =========================================

const CATEGORIES = [
  { id: "vip", label: "VIP" },
  { id: "veiculos", label: "Veículos" },
  { id: "mods", label: "Mods" },
  { id: "handling", label: "Handling" },
  { id: "scripts", label: "Scripts" },
  { id: "rp", label: "Itens RP" },
];

const PRODUCTS = [
  {
    id: "vip-bronze",
    name: "VIP Bronze (30 dias)",
    desc: "Tag VIP, salário extra, prioridade de fila. Exclusivo para Brasil Mundo Fênix (MTA).",
    price: 14.9,
    category: "vip",
    badge: "Popular",
  },
  {
    id: "vip-prata",
    name: "VIP Prata (30 dias)",
    desc: "Todos benefícios do Bronze + garagem extra e skin exclusiva.",
    price: 24.9,
    category: "vip",
    badge: "+Vendido",
  },
  {
    id: "vip-ouro",
    name: "VIP Ouro (30 dias)",
    desc: "Slots extras, /fix, veículo premium mensal e apoio prioritário.",
    price: 39.9,
    category: "vip",
  },
  {
    id: "car-hustler-fusca",
    name: "Hustler (som de Fusca) – pack sound",
    desc: "Som exclusivo estilo Fusca para Hustler. Compatível com a cidade BMF (MTA).",
    price: 11.9,
    category: "veiculos",
  },
  {
    id: "car-blista-ap",
    name: "Blista Compact (motor AP turbo)",
    desc: "Ronco personalizado com apito de turbina leve. Instalamos via resource.",
    price: 12.9,
    category: "veiculos",
  },
  {
    id: "mod-radio-px",
    name: "Rádio PX BR – falas nostálgicas",
    desc: "Áudios estilo rádio amador BR; tocam piadas/alertas ao atrasar entrega (ETS2 port para MTA).",
    price: 9.9,
    category: "mods",
  },
  {
    id: "handling-drift-rwd",
    name: "Handling Drift (RWD)",
    desc: "Pacote realista para drift traseira. Aceleração fina, suspensão rígida.",
    price: 7.9,
    category: "handling",
  },
  {
    id: "handling-carga-pesada",
    name: "Handling Carga Pesada (caminhão)",
    desc: "Centro de massa ajustado, torque inicial alto, freio calibrado para rotas RP.",
    price: 8.9,
    category: "handling",
  },
  {
    id: "script-lojinha",
    name: "Script Lojinha In-Game",
    desc: "GUI simples para comprar itens com coins BMF (inclui documentação).",
    price: 19.9,
    category: "scripts",
  },
  {
    id: "rp-placa-custom",
    name: "Placa personalizada (RP)",
    desc: "Troca de placa com verificação de placa única por banco de dados.",
    price: 6.9,
    category: "rp",
  },
];

function currencyBRL(n) {
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
  } catch {
    return `R$ ${n.toFixed(2)}`;
  }
}

export default function BMFSite() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("vip");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState({}); // id -> qty

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter(p =>
      (activeCat ? p.category === activeCat : true) &&
      (q ? (p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)) : true)
    );
  }, [query, activeCat]);

  const add = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const sub = (id) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] || 0) - 1) }));
  const remove = (id) => setCart((c) => { const x = { ...c }; delete x[id]; return x; });

  const itemsDetailed = Object.entries(cart)
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => ({ ...PRODUCTS.find(p => p.id === id), qty }));

  const subtotal = itemsDetailed.reduce((acc, it) => acc + it.price * it.qty, 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur bg-neutral-950/70">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Menu className="size-5 opacity-70" />
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl" style={{ background: "#FFA500" }} />
            <div>
              <div className="text-lg font-bold tracking-wide">Brasil Mundo Fênix</div>
              <div className="text-xs text-neutral-400">Loja oficial – Somente para MTA</div>
            </div>
          </div>

          <div className="flex-1" />

          <div className="hidden md:flex items-center gap-2 max-w-md w-full">
            <Search className="size-4 absolute ml-3 opacity-70" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar itens (ex: VIP, handling, scripts)"
              className="pl-9 bg-neutral-900 border-white/10"
            />
          </div>

          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button variant="secondary" className="ml-2 bg-white/10 hover:bg-white/20 border border-white/10">
                <ShoppingCart className="mr-2 size-4" /> Carrinho ({itemsDetailed.length})
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-neutral-950 text-neutral-50 border-l border-white/10 w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Seu carrinho</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3">
                {itemsDetailed.length === 0 && (
                  <div className="text-sm text-neutral-400">Seu carrinho está vazio.</div>
                )}
                {itemsDetailed.map((it) => (
                  <Card key={it.id} className="bg-neutral-900 border-white/10">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{it.name}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => remove(it.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                      <CardDescription className="text-neutral-400">{it.desc}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between py-2">
                      <div className="text-sm font-medium">{currencyBRL(it.price)}</div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="border-white/10" onClick={() => sub(it.id)}>
                          <Minus className="size-4" />
                        </Button>
                        <div className="w-8 text-center text-sm">{it.qty}</div>
                        <Button variant="outline" size="icon" className="border-white/10" onClick={() => add(it.id)}>
                          <Plus className="size-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-400">Subtotal</span>
                    <span className="font-semibold">{currencyBRL(subtotal)}</span>
                  </div>
                  <div className="mt-3 grid gap-2">
                    <Button className="w-full" style={{ background: "#FFA500", color: "#111" }}>
                      Finalizar pedido (Discord)
                    </Button>
                    <Button variant="secondary" className="w-full bg-white/10 hover:bg-white/20">
                      Salvar carrinho (gera código)
                    </Button>
                  </div>
                  <p className="mt-3 text-xs text-neutral-400">
                    Pagamentos e entregas são feitos <b>somente</b> via ticket no Discord da cidade. Este site serve como vitrine & carrinho.
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <Badge className="mb-3 bg-white/10 border border-white/10">Somente para MTA</Badge>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
                Loja Oficial <span className="px-2 rounded-xl" style={{ background: "#FFA500", color: "#111" }}>BMF</span>
              </h1>
              <p className="mt-3 text-neutral-300 max-w-xl">
                Itens, sons, scripts e serviços <b>exclusivos</b> para a cidade <b>Brasil Mundo Fênix</b> no MTA. Nada fora do jogo.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <a href="#catalogo"><Button style={{ background: "#FFA500", color: "#111" }}>Ver catálogo</Button></a>
                <a href="#como-funciona"><Button variant="secondary" className="bg-white/10 hover:bg-white/20">Como funciona</Button></a>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-neutral-400">
                <div className="flex items-center gap-2"><CheckCircle2 className="size-4"/> Entrega por resource</div>
                <div className="flex items-center gap-2"><Shield className="size-4"/> Autoria verificada</div>
                <div className="flex items-center gap-2"><Truck className="size-4"/> Download via Drive/MediaFire</div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl p-1 bg-gradient-to-br from-orange-500/60 to-yellow-400/30">
                <div className="rounded-2xl p-6 bg-neutral-900">
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="size-5" />
                    <span className="text-sm text-neutral-300">Vitrine em tempo real</span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {CATEGORIES.slice(0,6).map((c) => (
                      <div key={c.id} className="rounded-xl p-3 bg-neutral-800/60 text-center text-sm">
                        {c.label}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-neutral-400 flex items-center gap-2">
                    <PackageSearch className="size-4"/> Explore e adicione ao carrinho
                    <ChevronRight className="size-4"/>
                    <ShoppingCart className="size-4"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs + Search (mobile) */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 pb-12">
        <div className="md:hidden mb-4">
          <div className="relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar itens (ex: VIP, handling, scripts)"
              className="pl-9 bg-neutral-900 border-white/10"
            />
          </div>
        </div>

        <Tabs value={activeCat} onValueChange={setActiveCat}>
          <TabsList className="flex flex-wrap gap-2 bg-neutral-900 border border-white/10 p-1 rounded-2xl">
            {CATEGORIES.map((c) => (
              <TabsTrigger key={c.id} value={c.id} className="data-[state=active]:bg-white/10 rounded-xl">
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORIES.map((c) => (
            <TabsContent key={c.id} value={c.id} className="mt-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.length === 0 && (
                  <Card className="bg-neutral-900 border-white/10 col-span-full">
                    <CardHeader>
                      <CardTitle>Nada encontrado</CardTitle>
                      <CardDescription>Tente outra busca ou categoria.</CardDescription>
                    </CardHeader>
                  </Card>
                )}
                {filtered.map((p) => (
                  <Card key={p.id} className="bg-neutral-900 border-white/10 hover:border-white/20 transition">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg leading-tight">{p.name}</CardTitle>
                        {p.badge && (
                          <Badge className="bg-white/10 border border-white/10">{p.badge}</Badge>
                        )}
                      </div>
                      <CardDescription className="text-neutral-400 min-h-10">{p.desc}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xl font-extrabold" style={{ color: "#FFA500" }}>{currencyBRL(p.price)}</div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="flex items-center gap-2 w-full">
                        <Button className="flex-1" style={{ background: "#FFA500", color: "#111" }} onClick={() => add(p.id)}>
                          <ShoppingCart className="mr-2 size-4"/> Adicionar
                        </Button>
                        <Button variant="secondary" className="bg-white/10 hover:bg-white/20" onClick={() => setCartOpen(true)}>
                          Ver carrinho
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="border-t border-white/10 bg-neutral-900/40">
        <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-6">
          <Card className="bg-neutral-900 border-white/10">
            <CardHeader>
              <CardTitle>1) Monte seu carrinho</CardTitle>
              <CardDescription>Escolha itens apenas para MTA. Nada fora do jogo é vendido aqui.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-neutral-900 border-white/10">
            <CardHeader>
              <CardTitle>2) Abra ticket no Discord</CardTitle>
              <CardDescription>Envie o <b>código do carrinho</b> e combine pagamento/entrega com um staff.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-neutral-900 border-white/10">
            <CardHeader>
              <CardTitle>3) Receba por resource</CardTitle>
              <CardDescription>Entrega por <i>resource</i> no seu servidor/cidade com validação.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* FAQ & Contato */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-neutral-900 border-white/10">
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
              <CardDescription>Perguntas comuns sobre a loja BMF.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-neutral-300">
              <div>
                <b>É só para MTA?</b>
                <p>Sim. Todos os produtos são pensados para a cidade Brasil Mundo Fênix no MTA.</p>
              </div>
              <div>
                <b>Como pago?</b>
                <p>Ticket no Discord. Aceitamos Pix e outras formas combinadas com a staff.</p>
              </div>
              <div>
                <b>Como recebo?</b>
                <p>Por resource (instalação guiada) e/ou link de download (Drive/MediaFire) conforme item.</p>
              </div>
              <div>
                <b>Posso pedir algo sob medida?</b>
                <p>Sim! Fazemos handling por modelo, sons exclusivos e scripts personalizados.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-white/10">
            <CardHeader>
              <CardTitle>Contato & Comunidade</CardTitle>
              <CardDescription>Centralize o atendimento no Discord.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-neutral-300">
                <Info className="size-4" />
                <span>
                  <b>Discord:</b> <a className="underline" href="#" onClick={(e)=>e.preventDefault()}>discord.gg/brasilmundofenix</a>
                </span>
              </div>
              <div className="text-neutral-400 text-xs">
                Dica: conecte este site ao seu bot para gerar e validar códigos de carrinho no ticket.
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-neutral-400 flex flex-col md:flex-row items-center gap-3 justify-between">
          <div>
            © {new Date().getFullYear()} Brasil Mundo Fênix — Loja MTA • <span className="text-neutral-300">versão beta</span>
          </div>
          <div className="flex items-center gap-3">
            <a className="hover:text-neutral-200" href="#catalogo">Catálogo</a>
            <a className="hover:text-neutral-200" href="#como-funciona">Como funciona</a>
            <a className="hover:text-neutral-200" href="#">Termos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
