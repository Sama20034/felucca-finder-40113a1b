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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      affiliate_referrals: {
        Row: {
          affiliate_id: string
          commission_amount: number | null
          created_at: string | null
          id: string
          order_id: number | null
          order_total: number | null
          referred_user_id: string | null
          status: string | null
        }
        Insert: {
          affiliate_id: string
          commission_amount?: number | null
          created_at?: string | null
          id?: string
          order_id?: number | null
          order_total?: number | null
          referred_user_id?: string | null
          status?: string | null
        }
        Update: {
          affiliate_id?: string
          commission_amount?: number | null
          created_at?: string | null
          id?: string
          order_id?: number | null
          order_total?: number | null
          referred_user_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          commission_rate: number | null
          created_at: string | null
          id: string
          paid_earnings: number | null
          pending_earnings: number | null
          referral_code: string
          status: string | null
          total_earnings: number | null
          total_referrals: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          paid_earnings?: number | null
          pending_earnings?: number | null
          referral_code: string
          status?: string | null
          total_earnings?: number | null
          total_referrals?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          paid_earnings?: number | null
          pending_earnings?: number | null
          referral_code?: string
          status?: string | null
          total_earnings?: number | null
          total_referrals?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: number
          product_id: number
          quantity: number
          selected_color_hex: string | null
          selected_color_name: string | null
          selected_color_name_ar: string | null
          selected_size: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          product_id: number
          quantity?: number
          selected_color_hex?: string | null
          selected_color_name?: string | null
          selected_color_name_ar?: string | null
          selected_size?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          product_id?: number
          quantity?: number
          selected_color_hex?: string | null
          selected_color_name?: string | null
          selected_color_name_ar?: string | null
          selected_size?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          description_ar: string | null
          display_order: number | null
          id: number
          image_url: string | null
          is_active: boolean | null
          name: string
          name_ar: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          display_order?: number | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          name: string
          name_ar: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          display_order?: number | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          name_ar?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          description_ar: string | null
          expires_at: string | null
          id: number
          is_active: boolean | null
          max_discount: number | null
          min_order_amount: number | null
          starts_at: string | null
          type: Database["public"]["Enums"]["coupon_type"]
          updated_at: string | null
          usage_limit: number | null
          used_count: number | null
          value: number
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          expires_at?: string | null
          id?: number
          is_active?: boolean | null
          max_discount?: number | null
          min_order_amount?: number | null
          starts_at?: string | null
          type?: Database["public"]["Enums"]["coupon_type"]
          updated_at?: string | null
          usage_limit?: number | null
          used_count?: number | null
          value: number
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          expires_at?: string | null
          id?: number
          is_active?: boolean | null
          max_discount?: number | null
          min_order_amount?: number | null
          starts_at?: string | null
          type?: Database["public"]["Enums"]["coupon_type"]
          updated_at?: string | null
          usage_limit?: number | null
          used_count?: number | null
          value?: number
        }
        Relationships: []
      }
      filter_options: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          name_ar: string
          type: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          name_ar: string
          type: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_ar?: string
          type?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      filter_settings: {
        Row: {
          created_at: string | null
          display_order: number | null
          filter_key: string
          id: string
          is_active: boolean | null
          name: string
          name_ar: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          filter_key: string
          id?: string
          is_active?: boolean | null
          name: string
          name_ar: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          filter_key?: string
          id?: string
          is_active?: boolean | null
          name?: string
          name_ar?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      loyalty_rewards: {
        Row: {
          created_at: string | null
          description: string | null
          description_ar: string | null
          id: number
          is_active: boolean | null
          name: string
          name_ar: string
          points_required: number
          type: Database["public"]["Enums"]["reward_type"]
          updated_at: string | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          name_ar: string
          points_required: number
          type: Database["public"]["Enums"]["reward_type"]
          updated_at?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          name_ar?: string
          points_required?: number
          type?: Database["public"]["Enums"]["reward_type"]
          updated_at?: string | null
          value?: number | null
        }
        Relationships: []
      }
      loyalty_settings: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          min_redemption_points: number | null
          points_per_pound: number | null
          points_value: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          min_redemption_points?: number | null
          points_per_pound?: number | null
          points_value?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          min_redemption_points?: number | null
          points_per_pound?: number | null
          points_value?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      loyalty_transactions: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          order_id: number | null
          points: number
          type: Database["public"]["Enums"]["loyalty_transaction_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          order_id?: number | null
          points: number
          type: Database["public"]["Enums"]["loyalty_transaction_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          order_id?: number | null
          points?: number
          type?: Database["public"]["Enums"]["loyalty_transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: number
          order_id: number
          product_id: number | null
          product_name: string
          product_name_ar: string | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          order_id: number
          product_id?: number | null
          product_name: string
          product_name_ar?: string | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: number
          order_id?: number
          product_id?: number | null
          product_name?: string
          product_name_ar?: string | null
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          created_at: string | null
          id: number
          note: string | null
          order_id: number
          status: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          note?: string | null
          order_id: number
          status: string
        }
        Update: {
          created_at?: string | null
          id?: number
          note?: string | null
          order_id?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          coupon_code: string | null
          created_at: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string
          discount_amount: number | null
          id: number
          loyalty_points_earned: number | null
          loyalty_points_used: number | null
          notes: string | null
          order_number: string | null
          referral_code: string | null
          shipping_address: string
          shipping_city: string | null
          shipping_cost: number | null
          shipping_governorate: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          total: number
          updated_at: string | null
          user_id: string | null
          wallet_amount_used: number | null
        }
        Insert: {
          coupon_code?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          discount_amount?: number | null
          id?: number
          loyalty_points_earned?: number | null
          loyalty_points_used?: number | null
          notes?: string | null
          order_number?: string | null
          referral_code?: string | null
          shipping_address: string
          shipping_city?: string | null
          shipping_cost?: number | null
          shipping_governorate?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          total: number
          updated_at?: string | null
          user_id?: string | null
          wallet_amount_used?: number | null
        }
        Update: {
          coupon_code?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          discount_amount?: number | null
          id?: number
          loyalty_points_earned?: number | null
          loyalty_points_used?: number | null
          notes?: string | null
          order_number?: string | null
          referral_code?: string | null
          shipping_address?: string
          shipping_city?: string | null
          shipping_cost?: number | null
          shipping_governorate?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number
          total?: number
          updated_at?: string | null
          user_id?: string | null
          wallet_amount_used?: number | null
        }
        Relationships: []
      }
      products: {
        Row: {
          badge: string | null
          brand: string | null
          brand_ar: string | null
          category_id: number | null
          colors: Json | null
          created_at: string | null
          description: string | null
          description_ar: string | null
          id: number
          image_url: string | null
          images: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          is_returnable: boolean | null
          length: string | null
          length_ar: string | null
          loyalty_points: number | null
          material: string | null
          material_ar: string | null
          name: string
          name_ar: string
          original_price: number | null
          price: number
          related_products: number[] | null
          sales_count: number | null
          show_in_deals: boolean | null
          size_guide_image: string | null
          sizes: string[] | null
          sku: string | null
          stock_quantity: number | null
          updated_at: string | null
        }
        Insert: {
          badge?: string | null
          brand?: string | null
          brand_ar?: string | null
          category_id?: number | null
          colors?: Json | null
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          id?: number
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_returnable?: boolean | null
          length?: string | null
          length_ar?: string | null
          loyalty_points?: number | null
          material?: string | null
          material_ar?: string | null
          name: string
          name_ar: string
          original_price?: number | null
          price: number
          related_products?: number[] | null
          sales_count?: number | null
          show_in_deals?: boolean | null
          size_guide_image?: string | null
          sizes?: string[] | null
          sku?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          badge?: string | null
          brand?: string | null
          brand_ar?: string | null
          category_id?: number | null
          colors?: Json | null
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          id?: number
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_returnable?: boolean | null
          length?: string | null
          length_ar?: string | null
          loyalty_points?: number | null
          material?: string | null
          material_ar?: string | null
          name?: string
          name_ar?: string
          original_price?: number | null
          price?: number
          related_products?: number[] | null
          sales_count?: number | null
          show_in_deals?: boolean | null
          size_guide_image?: string | null
          sizes?: string[] | null
          sku?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          governorate: string | null
          id: string
          loyalty_points: number | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          governorate?: string | null
          id: string
          loyalty_points?: number | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          governorate?: string | null
          id?: string
          loyalty_points?: number | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      return_requests: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          id: number
          order_id: number
          reason: string
          reason_ar: string | null
          refund_amount: number | null
          refund_points: number | null
          refund_type: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          id?: number
          order_id: number
          reason: string
          reason_ar?: string | null
          refund_amount?: number | null
          refund_points?: number | null
          refund_type?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          id?: number
          order_id?: number
          reason?: string
          reason_ar?: string | null
          refund_amount?: number | null
          refund_points?: number | null
          refund_type?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "return_requests_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      return_settings: {
        Row: {
          allow_money_refund: boolean | null
          allow_points_refund: boolean | null
          allow_wallet_refund: boolean | null
          created_at: string | null
          id: string
          is_returns_enabled: boolean | null
          points_bonus_percentage: number | null
          return_window_days: number | null
          updated_at: string | null
        }
        Insert: {
          allow_money_refund?: boolean | null
          allow_points_refund?: boolean | null
          allow_wallet_refund?: boolean | null
          created_at?: string | null
          id?: string
          is_returns_enabled?: boolean | null
          points_bonus_percentage?: number | null
          return_window_days?: number | null
          updated_at?: string | null
        }
        Update: {
          allow_money_refund?: boolean | null
          allow_points_refund?: boolean | null
          allow_wallet_refund?: boolean | null
          created_at?: string | null
          id?: string
          is_returns_enabled?: boolean | null
          points_bonus_percentage?: number | null
          return_window_days?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: number
          images: string[] | null
          is_approved: boolean | null
          product_id: number | null
          rating: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: number
          images?: string[] | null
          is_approved?: boolean | null
          product_id?: number | null
          rating: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: number
          images?: string[] | null
          is_approved?: boolean | null
          product_id?: number | null
          rating?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_settings: {
        Row: {
          created_at: string | null
          default_shipping_cost: number
          free_shipping_threshold: number | null
          id: string
          is_zone_based: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_shipping_cost?: number
          free_shipping_threshold?: number | null
          id?: string
          is_zone_based?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_shipping_cost?: number
          free_shipping_threshold?: number | null
          id?: string
          is_zone_based?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shipping_zones: {
        Row: {
          created_at: string | null
          display_order: number | null
          free_shipping_threshold: number | null
          id: string
          is_active: boolean | null
          name: string
          name_ar: string
          parent_id: string | null
          shipping_cost: number
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          free_shipping_threshold?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          name_ar: string
          parent_id?: string | null
          shipping_cost?: number
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          free_shipping_threshold?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_ar?: string
          parent_id?: string | null
          shipping_cost?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipping_zones_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "shipping_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          description_ar: string | null
          id: string
          order_id: number | null
          return_request_id: number | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          id?: string
          order_id?: number | null
          return_request_id?: number | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          id?: string
          order_id?: number | null
          return_request_id?: number | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_return_request_id_fkey"
            columns: ["return_request_id"]
            isOneToOne: false
            referencedRelation: "return_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string | null
          id: number
          product_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          product_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          product_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: { Args: never; Returns: string }
      get_constraints_sql: { Args: never; Returns: string }
      get_enums_sql: { Args: never; Returns: string }
      get_functions_sql: { Args: never; Returns: string }
      get_indexes_sql: { Args: never; Returns: string }
      get_public_tables: {
        Args: never
        Returns: {
          table_name: string
        }[]
      }
      get_rls_policies_sql: { Args: never; Returns: string }
      get_sequence_setvals_sql: { Args: never; Returns: string }
      get_sequences_sql: { Args: never; Returns: string }
      get_storage_sql: { Args: never; Returns: string }
      get_tables_sql: { Args: never; Returns: string }
      get_triggers_sql: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      keep_database_alive: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      coupon_type: "percentage" | "fixed"
      loyalty_transaction_type:
        | "earn"
        | "redeem"
        | "expire"
        | "adjust"
        | "refund"
      order_status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
      reward_type: "discount" | "free_shipping" | "gift"
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
      app_role: ["admin", "moderator", "user"],
      coupon_type: ["percentage", "fixed"],
      loyalty_transaction_type: [
        "earn",
        "redeem",
        "expire",
        "adjust",
        "refund",
      ],
      order_status: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      reward_type: ["discount", "free_shipping", "gift"],
    },
  },
} as const
