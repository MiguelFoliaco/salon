export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string | null
          created_at: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      branches: {
        Row: {
          address: string
          city: string | null
          configuration_id: string
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          address: string
          city?: string | null
          configuration_id: string
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          address?: string
          city?: string | null
          configuration_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branches_configuration_id_fkey"
            columns: ["configuration_id"]
            isOneToOne: false
            referencedRelation: "configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          logo: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo?: string | null
          name?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          auth_id: string
          client_type: Database["public"]["Enums"]["client_type_enum"]
          code_phone: string | null
          code_verification: string | null
          created_at: string | null
          email: string | null
          id: string
          identity_type: Database["public"]["Enums"]["identity_type_enum"]
          identity_value: string
          lastname: string
          lastname_2: string | null
          name: string
          phone: string
          photo: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          auth_id: string
          client_type?: Database["public"]["Enums"]["client_type_enum"]
          code_phone?: string | null
          code_verification?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          identity_type: Database["public"]["Enums"]["identity_type_enum"]
          identity_value: string
          lastname: string
          lastname_2?: string | null
          name: string
          phone: string
          photo?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          auth_id?: string
          client_type?: Database["public"]["Enums"]["client_type_enum"]
          code_phone?: string | null
          code_verification?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          identity_type?: Database["public"]["Enums"]["identity_type_enum"]
          identity_value?: string
          lastname?: string
          lastname_2?: string | null
          name?: string
          phone?: string
          photo?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      configurations: {
        Row: {
          address: string | null
          city: string | null
          code_verification_nit: string
          company_name: string
          country: string | null
          created_at: string | null
          department: string | null
          dian_resolution_date: string | null
          dian_resolution_number: string | null
          email: string | null
          id: string
          invoice_from: number | null
          invoice_prefix: string | null
          invoice_to: number | null
          nit: string
          phone: string | null
          trade_name: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          code_verification_nit: string
          company_name: string
          country?: string | null
          created_at?: string | null
          department?: string | null
          dian_resolution_date?: string | null
          dian_resolution_number?: string | null
          email?: string | null
          id?: string
          invoice_from?: number | null
          invoice_prefix?: string | null
          invoice_to?: number | null
          nit: string
          phone?: string | null
          trade_name?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          code_verification_nit?: string
          company_name?: string
          country?: string | null
          created_at?: string | null
          department?: string | null
          dian_resolution_date?: string | null
          dian_resolution_number?: string | null
          email?: string | null
          id?: string
          invoice_from?: number | null
          invoice_prefix?: string | null
          invoice_to?: number | null
          nit?: string
          phone?: string | null
          trade_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_me_public: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      employes: {
        Row: {
          address: string | null
          auth_id: string
          created_at: string | null
          gender: Database["public"]["Enums"]["employe_gender_enum"] | null
          hours_available: Json | null
          id: string
          is_active: boolean | null
          is_fashionist: boolean | null
          last_name: string
          name: string
          phone: string | null
          photo: string | null
          rol: Database["public"]["Enums"]["employe_rol_enum"] | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          auth_id: string
          created_at?: string | null
          gender?: Database["public"]["Enums"]["employe_gender_enum"] | null
          hours_available?: Json | null
          id?: string
          is_active?: boolean | null
          is_fashionist?: boolean | null
          last_name: string
          name: string
          phone?: string | null
          photo?: string | null
          rol?: Database["public"]["Enums"]["employe_rol_enum"] | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          auth_id?: string
          created_at?: string | null
          gender?: Database["public"]["Enums"]["employe_gender_enum"] | null
          hours_available?: Json | null
          id?: string
          is_active?: boolean | null
          is_fashionist?: boolean | null
          last_name?: string
          name?: string
          phone?: string | null
          photo?: string | null
          rol?: Database["public"]["Enums"]["employe_rol_enum"] | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      inventory_by_branch: {
        Row: {
          branch_id: string
          id: string
          max_stock: number | null
          min_stock: number | null
          product_id: string
          stock: number
          updated_at: string | null
        }
        Insert: {
          branch_id: string
          id?: string
          max_stock?: number | null
          min_stock?: number | null
          product_id: string
          stock?: number
          updated_at?: string | null
        }
        Update: {
          branch_id?: string
          id?: string
          max_stock?: number | null
          min_stock?: number | null
          product_id?: string
          stock?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_by_branch_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_by_branch_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          branch_id: string
          created_at: string | null
          id: string
          movement_type: Database["public"]["Enums"]["inventory_movement_type_enum"]
          notes: string | null
          product_id: string
          quantity: number
          reference_id: string | null
        }
        Insert: {
          branch_id: string
          created_at?: string | null
          id?: string
          movement_type: Database["public"]["Enums"]["inventory_movement_type_enum"]
          notes?: string | null
          product_id: string
          quantity: number
          reference_id?: string | null
        }
        Update: {
          branch_id?: string
          created_at?: string | null
          id?: string
          movement_type?: Database["public"]["Enums"]["inventory_movement_type_enum"]
          notes?: string | null
          product_id?: string
          quantity?: number
          reference_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      notification: {
        Row: {
          created_at: string | null
          data: Json | null
          deleted_at: string | null
          description: string
          id: string
          image: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          deleted_at?: string | null
          description: string
          id?: string
          image?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          deleted_at?: string | null
          description?: string
          id?: string
          image?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      product_gallery: {
        Row: {
          alt: string | null
          created_at: string | null
          id: string
          image_url: string
          product_id: string
        }
        Insert: {
          alt?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          product_id: string
        }
        Update: {
          alt?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          brand_id: string | null
          code: string | null
          created_at: string | null
          description: string | null
          estimate_time_in_minutes: number | null
          id: string
          image: string | null
          is_active: boolean | null
          is_service: boolean | null
          name: string
          product_type_id: string
          stock: number | null
          tax_id: string | null
          updated_at: string | null
          value: number
        }
        Insert: {
          brand_id?: string | null
          code?: string | null
          created_at?: string | null
          description?: string | null
          estimate_time_in_minutes?: number | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          is_service?: boolean | null
          name: string
          product_type_id: string
          stock?: number | null
          tax_id?: string | null
          updated_at?: string | null
          value: number
        }
        Update: {
          brand_id?: string | null
          code?: string | null
          created_at?: string | null
          description?: string | null
          estimate_time_in_minutes?: number | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          is_service?: boolean | null
          name?: string
          product_type_id?: string
          stock?: number | null
          tax_id?: string | null
          updated_at?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_product_type_id_fkey"
            columns: ["product_type_id"]
            isOneToOne: false
            referencedRelation: "product_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_tax_id_fkey"
            columns: ["tax_id"]
            isOneToOne: false
            referencedRelation: "taxes"
            referencedColumns: ["id"]
          },
        ]
      }
      push_token_device_x_user: {
        Row: {
          auth_id: string | null
          created_at: string | null
          device_id: string
          id: string
          push_token: string
          updated_at: string | null
        }
        Insert: {
          auth_id?: string | null
          created_at?: string | null
          device_id: string
          id?: string
          push_token: string
          updated_at?: string | null
        }
        Update: {
          auth_id?: string | null
          created_at?: string | null
          device_id?: string
          id?: string
          push_token?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      schedules: {
        Row: {
          branch_id: string
          client_id: string
          created_at: string | null
          employee_id: string | null
          end_time: string
          expires_at: string
          id: string
          notes: string | null
          product_id: string
          start_time: string
          status: Database["public"]["Enums"]["schedule_status_enum"] | null
          updated_at: string | null
        }
        Insert: {
          branch_id: string
          client_id: string
          created_at?: string | null
          employee_id?: string | null
          end_time: string
          expires_at?: string
          id?: string
          notes?: string | null
          product_id: string
          start_time: string
          status?: Database["public"]["Enums"]["schedule_status_enum"] | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: string
          client_id?: string
          created_at?: string | null
          employee_id?: string | null
          end_time?: string
          expires_at?: string
          id?: string
          notes?: string | null
          product_id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["schedule_status_enum"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      services_x_employee: {
        Row: {
          employee_id: string | null
          id: string
          service_id: string | null
        }
        Insert: {
          employee_id?: string | null
          id?: string
          service_id?: string | null
        }
        Update: {
          employee_id?: string | null
          id?: string
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_x_employee_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_x_employee_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      taxes: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
          percentage: number
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
          percentage: number
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          percentage?: number
        }
        Relationships: []
      }
      transaction_items: {
        Row: {
          branch_id: string
          id: string
          product_id: string
          quantity: number
          total_price: number
          transaction_id: string
          unit_price: number
        }
        Insert: {
          branch_id: string
          id?: string
          product_id: string
          quantity: number
          total_price: number
          transaction_id: string
          unit_price: number
        }
        Update: {
          branch_id?: string
          id?: string
          product_id?: string
          quantity?: number
          total_price?: number
          transaction_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "transaction_items_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_items_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          branch_id: string | null
          client_id: string | null
          created_at: string | null
          id: string
          payment_method: Database["public"]["Enums"]["payment_method_enum"]
          products: Json | null
          reference_code: string | null
          schedule_id: string | null
          services: Json | null
          status: Database["public"]["Enums"]["transaction_status_enum"] | null
          tax_amount: number | null
          total_amount: number
          transaction_type: Database["public"]["Enums"]["transaction_type_enum"]
        }
        Insert: {
          amount: number
          branch_id?: string | null
          client_id?: string | null
          created_at?: string | null
          id?: string
          payment_method: Database["public"]["Enums"]["payment_method_enum"]
          products?: Json | null
          reference_code?: string | null
          schedule_id?: string | null
          services?: Json | null
          status?: Database["public"]["Enums"]["transaction_status_enum"] | null
          tax_amount?: number | null
          total_amount: number
          transaction_type: Database["public"]["Enums"]["transaction_type_enum"]
        }
        Update: {
          amount?: number
          branch_id?: string | null
          client_id?: string | null
          created_at?: string | null
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method_enum"]
          products?: Json | null
          reference_code?: string | null
          schedule_id?: string | null
          services?: Json | null
          status?: Database["public"]["Enums"]["transaction_status_enum"] | null
          tax_amount?: number | null
          total_amount?: number
          transaction_type?: Database["public"]["Enums"]["transaction_type_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "transactions_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_unique_clients: {
        Args: never
        Returns: {
          auth_id: string
          id: string
        }[]
      }
    }
    Enums: {
      client_type_enum: "natural" | "juridico"
      employe_gender_enum: "male" | "female" | "other"
      employe_rol_enum: "admin" | "cashier" | "stylist"
      identity_type_enum: "DNI" | "PASSPORT" | "ID"
      inventory_movement_type_enum: "in" | "out" | "adjustment"
      notification_type:
        | "PRODUCT"
        | "SERVICE"
        | "PROMOTION"
        | "LOCATION"
        | "BRANCH"
      payment_method_enum:
        | "cash"
        | "card"
        | "transfer"
        | "nequi"
        | "daviplata"
        | "other"
      product_type_enum: "service" | "product"
      schedule_status_enum: "pending" | "confirmed" | "cancelled" | "completed"
      transaction_status_enum: "pending" | "completed" | "cancelled"
      transaction_type_enum: "income" | "expense"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      client_type_enum: ["natural", "juridico"],
      employe_gender_enum: ["male", "female", "other"],
      employe_rol_enum: ["admin", "cashier", "stylist"],
      identity_type_enum: ["DNI", "PASSPORT", "ID"],
      inventory_movement_type_enum: ["in", "out", "adjustment"],
      notification_type: [
        "PRODUCT",
        "SERVICE",
        "PROMOTION",
        "LOCATION",
        "BRANCH",
      ],
      payment_method_enum: [
        "cash",
        "card",
        "transfer",
        "nequi",
        "daviplata",
        "other",
      ],
      product_type_enum: ["service", "product"],
      schedule_status_enum: ["pending", "confirmed", "cancelled", "completed"],
      transaction_status_enum: ["pending", "completed", "cancelled"],
      transaction_type_enum: ["income", "expense"],
    },
  },
} as const
