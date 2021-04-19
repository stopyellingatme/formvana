import "reflect-metadata";
import { FieldConfig } from "./FieldConfig";
export declare function field(config: Partial<FieldConfig>): (target: any, propertyKey: string) => void;
