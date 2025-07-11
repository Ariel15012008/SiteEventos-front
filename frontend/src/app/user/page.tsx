"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { FaArrowDown } from "react-icons/fa";
import { FaRegEdit, FaTrash } from "react-icons/fa";
import Image from "next/image";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { authFetch } from "../utils/authFetch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface País {
  id: number;
  nome: string;
  codigo_iso: string;
}

interface Estado {
  id: number;
  nome: string;
  id_pais: number;
}

interface Cidade {
  id: number;
  nome: string;
  codigo_ibge: number;
  id_estado: number;
}

interface Endereco {
  id_pais: string;
  id_estado: string;
  id_cidade: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  endereco_primario: boolean;
}

interface SavedEndereco {
  id: number;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  nome_cidade: string;
  nome_estado: string;
  endereco_primario: boolean;
}

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
  });

  const [enderecos, setEnderecos] = useState<SavedEndereco[]>([]);
  const [currentEndereco, setCurrentEndereco] = useState<Endereco>({
    id_pais: "",
    id_estado: "",
    id_cidade: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    endereco_primario: false,
  });

  const [countries, setCountries] = useState<País[]>([]);
  const [states, setStates] = useState<Estado[]>([]);
  const [cities, setCities] = useState<Cidade[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const router = useRouter();

  const scrollToLocations = useCallback(() => {
    const element = document.getElementById("saved-locations");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const formatPhone = useCallback((value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  }, []);

  const formatCEP = useCallback((value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) {
      return numbers;
    }
    if (numbers.length <= 8) {
      return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  }, []);

  const handleNumericInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, field: keyof Endereco) => {
      const value = e.target.value.replace(/\D/g, "");
      setCurrentEndereco((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleCEPChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedValue = formatCEP(e.target.value);
      setCurrentEndereco((prev) => ({ ...prev, cep: formattedValue }));
    },
    [formatCEP]
  );

  const loadCountries = useCallback(async () => {
    try {
      const response = await authFetch(
        "http://localhost:8000/localidades/paises"
      );
      const data = await response.json();
      setCountries(data);
    } catch {
      toast.error("Erro ao carregar", {
        description: "Não foi possível carregar a lista de países",
      });
    }
  }, []);

  const loadStates = useCallback(async (paisId: string) => {
    if (!paisId) return;
    try {
      const response = await authFetch(
        `http://localhost:8000/localidades/estados?pais_id=${paisId}`
      );
      const data = await response.json();
      setStates(data);
    } catch {
      toast.error("Erro ao carregar", {
        description: "Não foi possível carregar a lista de estados",
      });
    }
  }, []);

  const loadCities = useCallback(async (estadoId: string) => {
    if (!estadoId) return;
    try {
      const response = await authFetch(
        `http://localhost:8000/localidades/cidades?estado_id=${estadoId}`
      );
      const data = await response.json();
      setCities(data);
    } catch {
      toast.error("Erro ao carregar", {
        description: "Não foi possível carregar a lista de cidades",
      });
    }
  }, []);

  useEffect(() => {
    authFetch("http://localhost:8000/auth/refresh-token", {
      method: "POST",
    }).catch(() => {
      toast.error("Erro de sessão", {
        description: "Não foi possível renovar sua sessão automaticamente",
      });
    });

    loadCountries();
  }, [loadCountries]);

  useEffect(() => {
    if (currentEndereco.id_pais) {
      loadStates(currentEndereco.id_pais);
    }
  }, [currentEndereco.id_pais, loadStates]);

  useEffect(() => {
    if (currentEndereco.id_estado) {
      loadCities(currentEndereco.id_estado);
    }
  }, [currentEndereco.id_estado, loadCities]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, enderecosResponse] = await Promise.all([
          authFetch("http://localhost:8000/users/me"),
          authFetch("http://localhost:8000/users/enderecos"),
        ]);

        const [userData, enderecosData] = await Promise.all([
          userResponse.json(),
          enderecosResponse.json(),
        ]);

        setFormData({
          nome: userData.nome || "",
          email: userData.email || "",
          telefone: userData.telefone ? formatPhone(userData.telefone) : "",
          senha: "",
        });

        setEnderecos(enderecosData.enderecos || []);
      } catch {
        toast.error("Erro ao carregar", {
          description: "Não foi possível carregar seus dados de perfil",
        });
        router.push("/login");
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [formatPhone, router]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const formatted = name === "telefone" ? formatPhone(value) : value;
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    },
    [formatPhone]
  );

  const handleEnderecoChange = useCallback(
    (key: keyof Endereco, value: string | boolean) => {
      setCurrentEndereco((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const saveEndereco = useCallback(
    async (enderecoData: Endereco) => {
      try {
        setIsSavingLocation(true);

        const estadoSelecionado = states.find(
          (e) => e.id.toString() === enderecoData.id_estado
        );
        const cidadeSelecionada = cities.find(
          (c) => c.id.toString() === enderecoData.id_cidade
        );

        if (!estadoSelecionado || !cidadeSelecionada) {
          toast.error("Dados incompletos", {
            description: "Selecione um estado e cidade válidos",
          });
          return null;
        }

        const requestBody = {
          cep: enderecoData.cep.replace(/\D/g, ""),
          logradouro: enderecoData.logradouro,
          numero: enderecoData.numero,
          complemento: enderecoData.complemento || "",
          bairro: enderecoData.bairro,
          nome_cidade: cidadeSelecionada.nome,
          nome_estado: estadoSelecionado.nome,
          endereco_primario: enderecoData.endereco_primario,
        };

        const response = await authFetch(
          "http://localhost:8000/users/create-endereco",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Erro ao salvar localização");
        }

        const result = await response.json();

        toast.success("Localização salva!", {
          description: "Seu endereço foi cadastrado com sucesso",
        });

        setShowArrow(!!enderecoData.complemento);

        const enderecosResponse = await authFetch(
          "http://localhost:8000/users/enderecos"
        );
        const enderecosData = await enderecosResponse.json();
        setEnderecos(enderecosData.enderecos || []);

        return result;
      } catch (err: unknown) {
        toast.error("Falha ao salvar", {
          description:
            err instanceof Error
              ? err.message
              : "Ocorreu um erro ao tentar salvar a localização",
        });
        return null;
      } finally {
        setIsSavingLocation(false);
      }
    },
    [cities, states]
  );

  const addEndereco = useCallback(async () => {
    if (
      !currentEndereco.id_pais ||
      !currentEndereco.id_estado ||
      !currentEndereco.id_cidade
    ) {
      toast.error("Dados obrigatórios", {
        description: "Preencha país, estado e cidade",
      });
      return;
    }

    const result = await saveEndereco(currentEndereco);

    if (result) {
      setCurrentEndereco({
        id_pais: "",
        id_estado: "",
        id_cidade: "",
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        endereco_primario: false,
      });
    }
  }, [currentEndereco, saveEndereco]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        const response = await authFetch("http://localhost:8000/users/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pessoa: {
              nome_completo: formData.nome,
              email: formData.email,
              telefone_celular: formData.telefone.replace(/\D/g, ""),
            },
            usuario: {
              email: formData.email,
              senha: formData.senha || undefined,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Erro ao atualizar perfil");
        }

        toast.success("Perfil atualizado!", {
          description: "Seus dados foram salvos com sucesso",
        });

        setFormData((prev) => ({ ...prev, senha: "" }));
      } catch (err: unknown) {
        toast.error("Falha na atualização", {
          description:
            err instanceof Error
              ? err.message
              : "Ocorreu um erro ao tentar atualizar seu perfil",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [formData]
  );

  const deleteAddress = useCallback(async (id: number) => {
    try {
      const response = await authFetch(
        `http://localhost:8000/endereco/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao deletar endereço");
      }

      const enderecosResponse = await authFetch(
        "http://localhost:8000/users/enderecos"
      );
      const enderecosData = await enderecosResponse.json();
      setEnderecos(enderecosData.enderecos || []);

      toast.success("Endereço deletado com sucesso!");
    } catch {
      toast.error("Erro", {
        description: "Não foi possível deletar este endereço",
      });
    }
  }, []);

  const confirmDelete = useCallback(
    (id: number) => {
      const primaryAddress = enderecos.find((e) => e.endereco_primario);

      if (primaryAddress && primaryAddress.id === id && enderecos.length > 1) {
        toast.error("Não é possível excluir o endereço principal", {
          description:
            "Defina outro endereço como principal antes de excluir este",
        });
        return;
      }

      toast.custom(
        (t) => (
          <div className="bg-white p-4 rounded-lg shadow-lg border border-purple-200">
            <p className="font-medium text-purple-800">
              Tem certeza que deseja excluir este endereço?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  deleteAddress(id);
                  toast.dismiss(t);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-sm font-medium">
                Confirmar
              </button>
              <button
                onClick={() => toast.dismiss(t)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm font-medium">
                Cancelar
              </button>
            </div>
          </div>
        ),
        {
          duration: 10000,
        }
      );
    },
    [deleteAddress, enderecos]
  );

  if (isFetching) {
    return (
      <main className=" min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-pink-950 to-indigo-700">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <div className="font-sans bg-gradient-to-br from-purple-700 to-indigo-950 ">
      <Header />
      <main className=" min-h-screen px-4 py-10">
        <div className="max-w-3xl mx-auto bg-[#ffffff] rounded-lg shadow-lg p-6 mt-20">
          <div className="flex flex-col items-center justify-center gap-4 mb-8 md:mb-10">
            <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-full overflow-hidden shadow-md border-2 border-purple-500">
              <Image
                src="/img/perfil-placeholder.png"
                alt="Foto de perfil"
                fill
                className="object-cover"
                priority
              />
            </div>
            <p className="text-lg md:text-xl font-semibold text-purple-800">{formData.nome}</p>
            <Button
              variant="outline"
              className="text-sm md:text-base cursor-pointer text-purple-600 hover:bg-purple-50">
              Trocar foto
            </Button>
          </div>

          {!showLocationForm ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-black">Nome completo</Label>
                <Input
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label className="text-black">Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label className="text-black">Telefone</Label>
                <Input
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  maxLength={15}
                  required
                />
              </div>
              <div>
                <Label className="text-black">Nova Senha</Label>
                <div className="relative">
                  <Input
                    name="senha"
                    type={showPassword ? "text" : "password"}
                    value={formData.senha}
                    onChange={handleChange}
                    placeholder="Deixe em branco para manter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 cursor-pointer">
                    {showPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
                  </button>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setShowLocationForm(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700">
                Adicionar informação de localização
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-purple-800">País</Label>
                  <Select
                    value={currentEndereco.id_pais}
                    onValueChange={(v) => handleEnderecoChange("id_pais", v)}>
                    <SelectTrigger className="w-full ">
                      <SelectValue placeholder="País" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {countries.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-purple-800">Estado</Label>
                  <Select
                    value={currentEndereco.id_estado}
                    onValueChange={(v) => handleEnderecoChange("id_estado", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {states.map((e) => (
                        <SelectItem key={e.id} value={e.id.toString()}>
                          {e.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-purple-800">Cidade</Label>
                  <Select
                    value={currentEndereco.id_cidade}
                    onValueChange={(v) => handleEnderecoChange("id_cidade", v)}>
                    <SelectTrigger className="w-full ">
                      <SelectValue placeholder="Cidade" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {cities.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-purple-800">CEP</Label>
                  <Input
                    value={currentEndereco.cep}
                    onChange={handleCEPChange}
                    placeholder="00000-000"
                    maxLength={9}
                  />
                </div>
                <div>
                  <Label className="text-purple-800">Bairro</Label>
                  <Input
                    value={currentEndereco.bairro}
                    onChange={(e) =>
                      handleEnderecoChange("bairro", e.target.value)
                    }
                    placeholder="Bairro"
                  />
                </div>
                <div>
                  <Label className="text-purple-800">Logradouro</Label>
                  <Input
                    value={currentEndereco.logradouro}
                    onChange={(e) =>
                      handleEnderecoChange("logradouro", e.target.value)
                    }
                    placeholder="Logradouro"
                  />
                </div>
                <div>
                  <Label className="text-purple-800">Número</Label>
                  <Input
                    value={currentEndereco.numero}
                    onChange={(e) => handleNumericInput(e, "numero")}
                    placeholder="Número"
                  />
                </div>
                <div className="relative pb-10">
                  <Label className="text-purple-800">Complemento</Label>
                  <Input
                    value={currentEndereco.complemento || ""}
                    onChange={(e) =>
                      handleEnderecoChange("complemento", e.target.value)
                    }
                    placeholder="Complemento (opcional)"
                    className={`mt-1 ${showArrow ? "mb-6" : ""}`}
                  />
                  {showArrow && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 sm:left-[100%] sm:translate-x-0">
                      <button
                        onClick={scrollToLocations}
                        className="animate-bounce cursor-pointer">
                        <FaArrowDown className="text-purple-600 text-3xl" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 pb-6 pl-3">
                  <Checkbox
                    id="endereco-primario"
                    checked={currentEndereco.endereco_primario}
                    onCheckedChange={(checked) =>
                      handleEnderecoChange(
                        "endereco_primario",
                        checked as boolean
                      )
                    }
                    className="border-purple-300 data-[state=checked]:bg-purple-600"
                  />
                  <label
                    htmlFor="endereco-primario"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-purple-800">
                    Definir como endereço principal
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-6">
                <Button
                  onClick={addEndereco}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                  disabled={isSavingLocation}>
                  {isSavingLocation ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Adicionar localização"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentEndereco({
                      id_pais: "",
                      id_estado: "",
                      id_cidade: "",
                      cep: "",
                      logradouro: "",
                      numero: "",
                      complemento: "",
                      bairro: "",
                      endereco_primario: false,
                    });
                    setShowLocationForm(false);
                    setShowArrow(false);
                  }}
                  className="w-full border-purple-500 text-purple-600 hover:bg-purple-50">
                  Voltar
                </Button>
              </div>

              {enderecos.length > 0 && (
                <div id="saved-locations" className="pt-8 space-y-4">
                  <h3 className="text-lg font-semibold text-purple-800">
                    Endereços cadastrados
                  </h3>
                  {enderecos.map((e, i) => (
                    <div
                      key={e.id}
                      className={`p-4 border rounded-md space-y-1 text-sm ${
                        e.endereco_primario
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 bg-gray-50"
                      }`}>
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-purple-800">
                          {i + 1} -{" "}
                          {e.endereco_primario
                            ? "Endereço principal"
                            : "Endereço secundário"}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/editAddress/${e.id}`)}
                            className="border-purple-500 text-purple-600 hover:bg-purple-50">
                            <FaRegEdit className="size-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => confirmDelete(e.id)}
                            className="border-red-500 text-red-600 hover:bg-red-50">
                            <FaTrash className="size-4" />
                          </Button>
                        </div>
                      </div>
                      <p>
                        <strong className="text-purple-700">Estado:</strong> {e.nome_estado}
                      </p>
                      <p>
                        <strong className="text-purple-700">Cidade:</strong> {e.nome_cidade}
                      </p>
                      <p>
                        <strong className="text-purple-700">Logradouro:</strong> {e.logradouro}
                      </p>
                      <p>
                        <strong className="text-purple-700">Número:</strong> {e.numero}
                      </p>
                      {e.complemento && (
                        <p className="text-purple-600 font-medium">
                          <strong>Complemento:</strong> {e.complemento}
                        </p>
                      )}
                      <p>
                        <strong className="text-purple-700">Bairro:</strong> {e.bairro}
                      </p>
                      <p>
                        <strong className="text-purple-700">CEP:</strong> {e.cep}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />

      <Toaster
        position="bottom-right"
        toastOptions={{
          unstyled: true,
          classNames: {
            toast: `
              bg-white
              border border-purple-200
              flex items-center 
              p-4 rounded-md 
              shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)]
              gap-4 
              max-w-[320px] w-full
              text-gray-800
            `,
            title: "font-bold text-sm text-purple-800",
            description: "text-sm text-purple-700",
            error: `
              !bg-red-100
              !border-red-300
              !text-red-800
            `,
            success: `
              !bg-green-100
              !border-green-300
              !text-green-800
            `,
            actionButton: `
              bg-purple-600 hover:bg-purple-700
              text-white 
              px-3 py-1 
              rounded-md 
              text-sm font-medium
            `,
            cancelButton: `
              bg-gray-200 hover:bg-gray-300
              text-gray-800 
              px-3 py-1 
              rounded-md 
              text-sm font-medium 
              ml-2
            `,
          },
        }}
      />
    </div>
  );
}