export interface Producer {
  cpfCnpj: string;
  name: string;
  farmName: string;
  city: string;
  state: string;
  totalArea: number;
  agriculturalArea: number;
  vegetationArea: number;
  crops: string[];
}

export const cropsOptions = ["Soy", "Corn", "Cotton", "Coffee", "Sugar Cane"];
