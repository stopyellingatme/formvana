import "reflect-metadata";
import { FieldConfig } from "./FieldConfig";
export declare function field<T extends Object>(config: Partial<FieldConfig<T>>): (target: any, propertyKey: string) => void;
