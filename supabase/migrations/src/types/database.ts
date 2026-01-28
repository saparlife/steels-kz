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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          last_login_at: string | null
          name: string
          password_hash: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          name: string
          password_hash: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          name?: string
          password_hash?: string
          role?: string | null
        }
        Relationships: []
      }
      attribute_definitions: {
        Row: {
          created_at: string | null
          id: string
          is_filterable: boolean | null
          is_searchable: boolean | null
          name_kz: string | null
          name_ru: string
          options: Json | null
          slug: string
          sort_order: number | null
          type: string
          unit: string | null
          unit_kz: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_filterable?: boolean | null
          is_searchable?: boolean | null
          name_kz?: string | null
          name_ru: string
          options?: Json | null
          slug: string
          sort_order?: number | null
          type?: string
          unit?: string | null
          unit_kz?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_filterable?: boolean | null
          is_searchable?: boolean | null
          name_kz?: string | null
          name_ru?: string
          options?: Json | null
          slug?: string
          sort_order?: number | null
          type?: string
          unit?: string | null
          unit_kz?: string | null
        }
        Relationships: []
      }
      banners: {
        Row: {
          created_at: string | null
          ends_at: string | null
          id: string
          image_url: string
          is_active: boolean | null
          link_url: string | null
          position: string | null
          sort_order: number | null
          starts_at: string | null
          subtitle_kz: string | null
          subtitle_ru: string | null
          title_kz: string | null
          title_ru: string | null
        }
        Insert: {
          created_at?: string | null
          ends_at?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          link_url?: string | null
          position?: string | null
          sort_order?: number | null
          starts_at?: string | null
          subtitle_kz?: string | null
          subtitle_ru?: string | null
          title_kz?: string | null
          title_ru?: string | null
        }
        Update: {
          created_at?: string | null
          ends_at?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          link_url?: string | null
          position?: string | null
          sort_order?: number | null
          starts_at?: string | null
          subtitle_kz?: string | null
          subtitle_ru?: string | null
          title_kz?: string | null
          title_ru?: string | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string | null
          description_kz: string | null
          description_ru: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          meta_description_kz: string | null
          meta_description_ru: string | null
          meta_title_kz: string | null
          meta_title_ru: string | null
          name_kz: string | null
          name_ru: string
          products_count: number | null
          slug: string
          sort_order: number | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          description_kz?: string | null
          description_ru?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          name_kz?: string | null
          name_ru: string
          products_count?: number | null
          slug: string
          sort_order?: number | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          description_kz?: string | null
          description_ru?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          name_kz?: string | null
          name_ru?: string
          products_count?: number | null
          slug?: string
          sort_order?: number | null
          website_url?: string | null
        }
        Relationships: []
      }
      cases: {
        Row: {
          client_name: string | null
          content_kz: string | null
          content_ru: string | null
          created_at: string | null
          excerpt_kz: string | null
          excerpt_ru: string | null
          id: string
          image_url: string | null
          industry: string | null
          is_active: boolean | null
          meta_description_kz: string | null
          meta_description_ru: string | null
          meta_title_kz: string | null
          meta_title_ru: string | null
          published_at: string | null
          slug: string
          title_kz: string | null
          title_ru: string
        }
        Insert: {
          client_name?: string | null
          content_kz?: string | null
          content_ru?: string | null
          created_at?: string | null
          excerpt_kz?: string | null
          excerpt_ru?: string | null
          id?: string
          image_url?: string | null
          industry?: string | null
          is_active?: boolean | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          published_at?: string | null
          slug: string
          title_kz?: string | null
          title_ru: string
        }
        Update: {
          client_name?: string | null
          content_kz?: string | null
          content_ru?: string | null
          created_at?: string | null
          excerpt_kz?: string | null
          excerpt_ru?: string | null
          id?: string
          image_url?: string | null
          industry?: string | null
          is_active?: boolean | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          published_at?: string | null
          slug?: string
          title_kz?: string | null
          title_ru?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description_kz: string | null
          description_ru: string | null
          icon_url: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          level: number | null
          meta_description_kz: string | null
          meta_description_ru: string | null
          meta_title_kz: string | null
          meta_title_ru: string | null
          name_kz: string | null
          name_ru: string
          parent_id: string | null
          path: string[] | null
          products_count: number | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description_kz?: string | null
          description_ru?: string | null
          icon_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          level?: number | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          name_kz?: string | null
          name_ru: string
          parent_id?: string | null
          path?: string[] | null
          products_count?: number | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description_kz?: string | null
          description_ru?: string | null
          icon_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          level?: number | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          name_kz?: string | null
          name_ru?: string
          parent_id?: string | null
          path?: string[] | null
          products_count?: number | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_attributes: {
        Row: {
          attribute_id: string
          category_id: string
          id: string
          is_required: boolean | null
          sort_order: number | null
        }
        Insert: {
          attribute_id: string
          category_id: string
          id?: string
          is_required?: boolean | null
          sort_order?: number | null
        }
        Update: {
          attribute_id?: string
          category_id?: string
          id?: string
          is_required?: boolean | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "category_attributes_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "attribute_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_attributes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          address_kz: string | null
          address_ru: string | null
          coordinates_lat: number | null
          coordinates_lng: number | null
          description_kz: string | null
          description_ru: string | null
          email: string | null
          has_warehouse: boolean | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          meta_description_kz: string | null
          meta_description_ru: string | null
          meta_title_kz: string | null
          meta_title_ru: string | null
          name_kz: string | null
          name_ru: string
          phone: string | null
          slug: string
          sort_order: number | null
          warehouse_address_kz: string | null
          warehouse_address_ru: string | null
          working_hours_kz: string | null
          working_hours_ru: string | null
        }
        Insert: {
          address_kz?: string | null
          address_ru?: string | null
          coordinates_lat?: number | null
          coordinates_lng?: number | null
          description_kz?: string | null
          description_ru?: string | null
          email?: string | null
          has_warehouse?: boolean | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          name_kz?: string | null
          name_ru: string
          phone?: string | null
          slug: string
          sort_order?: number | null
          warehouse_address_kz?: string | null
          warehouse_address_ru?: string | null
          working_hours_kz?: string | null
          working_hours_ru?: string | null
        }
        Update: {
          address_kz?: string | null
          address_ru?: string | null
          coordinates_lat?: number | null
          coordinates_lng?: number | null
          description_kz?: string | null
          description_ru?: string | null
          email?: string | null
          has_warehouse?: boolean | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          name_kz?: string | null
          name_ru?: string
          phone?: string | null
          slug?: string
          sort_order?: number | null
          warehouse_address_kz?: string | null
          warehouse_address_ru?: string | null
          working_hours_kz?: string | null
          working_hours_ru?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string | null
          description_kz: string | null
          description_ru: string | null
          file_url: string | null
          id: string
          is_active: boolean | null
          issue_date: string | null
          issuer: string | null
          slug: string
          sort_order: number | null
          title_kz: string | null
          title_ru: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description_kz?: string | null
          description_ru?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          issue_date?: string | null
          issuer?: string | null
          slug: string
          sort_order?: number | null
          title_kz?: string | null
          title_ru: string
          type: string
        }
        Update: {
          created_at?: string | null
          description_kz?: string | null
          description_ru?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          issue_date?: string | null
          issuer?: string | null
          slug?: string
          sort_order?: number | null
          title_kz?: string | null
          title_ru?: string
          type?: string
        }
        Relationships: []
      }
      faq: {
        Row: {
          answer_kz: string | null
          answer_ru: string
          category: string | null
          category_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          page_slug: string | null
          question_kz: string | null
          question_ru: string
          sort_order: number | null
        }
        Insert: {
          answer_kz?: string | null
          answer_ru: string
          category?: string | null
          category_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          page_slug?: string | null
          question_kz?: string | null
          question_ru: string
          sort_order?: number | null
        }
        Update: {
          answer_kz?: string | null
          answer_ru?: string
          category?: string | null
          category_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          page_slug?: string | null
          question_kz?: string | null
          question_ru?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "faq_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "faq_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      faq_categories: {
        Row: {
          created_at: string | null
          description_kz: string | null
          description_ru: string | null
          id: string
          is_active: boolean | null
          name_kz: string | null
          name_ru: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          description_kz?: string | null
          description_ru?: string | null
          id?: string
          is_active?: boolean | null
          name_kz?: string | null
          name_ru: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          description_kz?: string | null
          description_ru?: string | null
          id?: string
          is_active?: boolean | null
          name_kz?: string | null
          name_ru?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      glossary_terms: {
        Row: {
          created_at: string | null
          definition_kz: string | null
          definition_ru: string
          id: string
          is_active: boolean | null
          meta_description_kz: string | null
          meta_description_ru: string | null
          meta_title_kz: string | null
          meta_title_ru: string | null
          slug: string
          sort_order: number | null
          term_kz: string | null
          term_ru: string
        }
        Insert: {
          created_at?: string | null
          definition_kz?: string | null
          definition_ru: string
          id?: string
          is_active?: boolean | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          slug: string
          sort_order?: number | null
          term_kz?: string | null
          term_ru: string
        }
        Update: {
          created_at?: string | null
          definition_kz?: string | null
          definition_ru?: string
          id?: string
          is_active?: boolean | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          slug?: string
          sort_order?: number | null
          term_kz?: string | null
          term_ru?: string
        }
        Relationships: []
      }
      gost_standards: {
        Row: {
          content_kz: string | null
          content_ru: string | null
          created_at: string | null
          description_kz: string | null
          description_ru: string | null
          document_url: string | null
          id: string
          is_active: boolean | null
          meta_description_kz: string | null
          meta_description_ru: string | null
          meta_title_kz: string | null
          meta_title_ru: string | null
          number: string
          slug: string
          title_kz: string | null
          title_ru: string
        }
        Insert: {
          content_kz?: string | null
          content_ru?: string | null
          created_at?: string | null
          description_kz?: string | null
          description_ru?: string | null
          document_url?: string | null
          id?: string
          is_active?: boolean | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          number: string
          slug: string
          title_kz?: string | null
          title_ru: string
        }
        Update: {
          content_kz?: string | null
          content_ru?: string | null
          created_at?: string | null
          description_kz?: string | null
          description_ru?: string | null
          document_url?: string | null
          id?: string
          is_active?: boolean | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          number?: string
          slug?: string
          title_kz?: string | null
          title_ru?: string
        }
        Relationships: []
      }
      guides: {
        Row: {
          category: string | null
          content_kz: string | null
          content_ru: string | null
          created_at: string | null
          excerpt_kz: string | null
          excerpt_ru: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          meta_description_kz: string | null
          meta_description_ru: string | null
          meta_title_kz: string | null
          meta_title_ru: string | null
          published_at: string | null
          slug: string
          title_kz: string | null
          title_ru: string
        }
        Insert: {
          category?: string | null
          content_kz?: string | null
          content_ru?: string | null
          created_at?: string | null
          excerpt_kz?: string | null
          excerpt_ru?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          published_at?: string | null
          slug: string
          title_kz?: string | null
          title_ru: string
        }
        Update: {
          category?: string | null
          content_kz?: string | null
          content_ru?: string | null
          created_at?: string | null
          excerpt_kz?: string | null
          excerpt_ru?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          published_at?: string | null
          slug?: string
          title_kz?: string | null
          title_ru?: string
        }
        Relationships: []
      }
      image_mapping: {
        Row: {
          created_at: string | null
          file_name: string | null
          id: string
          source_url: string
          storage_url: string | null
        }
        Insert: {
          created_at?: string | null
          file_name?: string | null
          id?: string
          source_url: string
          storage_url?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string | null
          id?: string
          source_url?: string
          storage_url?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          category_id: string | null
          city: string | null
          company: string | null
          created_at: string | null
          email: string | null
          id: string
          manager_notes: string | null
          message: string | null
          name: string
          phone: string
          processed_at: string | null
          product_id: string | null
          source_page: string | null
          status: string | null
          type: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          category_id?: string | null
          city?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          manager_notes?: string | null
          message?: string | null
          name: string
          phone: string
          processed_at?: string | null
          product_id?: string | null
          source_page?: string | null
          status?: string | null
          type: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          category_id?: string | null
          city?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          manager_notes?: string | null
          message?: string | null
          name?: string
          phone?: string
          processed_at?: string | null
          product_id?: string | null
          source_page?: string | null
          status?: string | null
          type?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      manufacturers: {
        Row: {
          country: string | null
          created_at: string | null
          description_kz: string | null
          description_ru: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          meta_description_kz: string | null
          meta_description_ru: string | null
          meta_title_kz: string | null
          meta_title_ru: string | null
          name_kz: string | null
          name_ru: string
          products_count: number | null
          slug: string
          sort_order: number | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          description_kz?: string | null
          description_ru?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          name_kz?: string | null
          name_ru: string
          products_count?: number | null
          slug: string
          sort_order?: number | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          description_kz?: string | null
          description_ru?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          name_kz?: string | null
          name_ru?: string
          products_count?: number | null
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      news: {
        Row: {
          content_kz: string | null
          content_ru: string | null
          created_at: string | null
          excerpt_kz: string | null
          excerpt_ru: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          meta_description_kz: string | null
          meta_description_ru: string | null
          meta_title_kz: string | null
          meta_title_ru: string | null
          published_at: string | null
          slug: string
          title_kz: string | null
          title_ru: string
          updated_at: string | null
        }
        Insert: {
          content_kz?: string | null
          content_ru?: string | null
          created_at?: string | null
          excerpt_kz?: string | null
          excerpt_ru?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          published_at?: string | null
          slug: string
          title_kz?: string | null
          title_ru: string
          updated_at?: string | null
        }
        Update: {
          content_kz?: string | null
          content_ru?: string | null
          created_at?: string | null
          excerpt_kz?: string | null
          excerpt_ru?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          published_at?: string | null
          slug?: string
          title_kz?: string | null
          title_ru?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      offer_products: {
        Row: {
          id: string
          offer_id: string | null
          product_id: string | null
          special_price: number | null
        }
        Insert: {
          id?: string
          offer_id?: string | null
          product_id?: string | null
          special_price?: number | null
        }
        Update: {
          id?: string
          offer_id?: string | null
          product_id?: string | null
          special_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "offer_products_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "special_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offer_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content_kz: string | null
          content_ru: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          meta_description_kz: string | null
          meta_description_ru: string | null
          meta_title_kz: string | null
          meta_title_ru: string | null
          slug: string
          sort_order: number | null
          title_kz: string | null
          title_ru: string
          updated_at: string | null
        }
        Insert: {
          content_kz?: string | null
          content_ru?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          slug: string
          sort_order?: number | null
          title_kz?: string | null
          title_ru: string
          updated_at?: string | null
        }
        Update: {
          content_kz?: string | null
          content_ru?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          slug?: string
          sort_order?: number | null
          title_kz?: string | null
          title_ru?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      parse_progress: {
        Row: {
          attributes_parsed: boolean | null
          category_id: string
          error_message: string | null
          last_page: number | null
          products_count: number | null
          products_parsed: boolean | null
          source_url: string | null
          updated_at: string | null
        }
        Insert: {
          attributes_parsed?: boolean | null
          category_id: string
          error_message?: string | null
          last_page?: number | null
          products_count?: number | null
          products_parsed?: boolean | null
          source_url?: string | null
          updated_at?: string | null
        }
        Update: {
          attributes_parsed?: boolean | null
          category_id?: string
          error_message?: string | null
          last_page?: number | null
          products_count?: number | null
          products_parsed?: boolean | null
          source_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parse_progress_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: true
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_attributes: {
        Row: {
          attribute_id: string
          id: string
          product_id: string
          value_boolean: boolean | null
          value_number: number | null
          value_text: string | null
        }
        Insert: {
          attribute_id: string
          id?: string
          product_id: string
          value_boolean?: boolean | null
          value_number?: number | null
          value_text?: string | null
        }
        Update: {
          attribute_id?: string
          id?: string
          product_id?: string
          value_boolean?: boolean | null
          value_number?: number | null
          value_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_attributes_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "attribute_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_attributes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_kz: string | null
          alt_ru: string | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          product_id: string
          sort_order: number | null
          source_url: string | null
          url: string
        }
        Insert: {
          alt_kz?: string | null
          alt_ru?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          product_id: string
          sort_order?: number | null
          source_url?: string | null
          url: string
        }
        Update: {
          alt_kz?: string | null
          alt_ru?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          product_id?: string
          sort_order?: number | null
          source_url?: string | null
          url?: string
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
      products: {
        Row: {
          brand_id: string | null
          category_id: string
          category_path: string[] | null
          created_at: string | null
          currency: string | null
          description_kz: string | null
          description_ru: string | null
          id: string
          in_stock: boolean | null
          is_active: boolean | null
          is_featured: boolean | null
          manufacturer_id: string | null
          meta_description_kz: string | null
          meta_description_ru: string | null
          meta_title_kz: string | null
          meta_title_ru: string | null
          name_kz: string | null
          name_ru: string
          old_price: number | null
          price: number | null
          short_description_kz: string | null
          short_description_ru: string | null
          sku: string | null
          slug: string
          sort_order: number | null
          source_url: string | null
          stock_quantity: number | null
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          brand_id?: string | null
          category_id: string
          category_path?: string[] | null
          created_at?: string | null
          currency?: string | null
          description_kz?: string | null
          description_ru?: string | null
          id?: string
          in_stock?: boolean | null
          is_active?: boolean | null
          is_featured?: boolean | null
          manufacturer_id?: string | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          name_kz?: string | null
          name_ru: string
          old_price?: number | null
          price?: number | null
          short_description_kz?: string | null
          short_description_ru?: string | null
          sku?: string | null
          slug: string
          sort_order?: number | null
          source_url?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          brand_id?: string | null
          category_id?: string
          category_path?: string[] | null
          created_at?: string | null
          currency?: string | null
          description_kz?: string | null
          description_ru?: string | null
          id?: string
          in_stock?: boolean | null
          is_active?: boolean | null
          is_featured?: boolean | null
          manufacturer_id?: string | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          name_kz?: string | null
          name_ru?: string
          old_price?: number | null
          price?: number | null
          short_description_kz?: string | null
          short_description_ru?: string | null
          sku?: string | null
          slug?: string
          sort_order?: number | null
          source_url?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
          views_count?: number | null
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
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "manufacturers"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          author_name: string
          company: string | null
          content_kz: string | null
          content_ru: string
          created_at: string | null
          id: string
          is_active: boolean | null
          rating: number | null
          sort_order: number | null
        }
        Insert: {
          author_name: string
          company?: string | null
          content_kz?: string | null
          content_ru: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          rating?: number | null
          sort_order?: number | null
        }
        Update: {
          author_name?: string
          company?: string | null
          content_kz?: string | null
          content_ru?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          rating?: number | null
          sort_order?: number | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          type: string | null
          updated_at: string | null
          value_kz: string | null
          value_ru: string | null
        }
        Insert: {
          id?: string
          key: string
          type?: string | null
          updated_at?: string | null
          value_kz?: string | null
          value_ru?: string | null
        }
        Update: {
          id?: string
          key?: string
          type?: string | null
          updated_at?: string | null
          value_kz?: string | null
          value_ru?: string | null
        }
        Relationships: []
      }
      special_offers: {
        Row: {
          created_at: string | null
          description_kz: string | null
          description_ru: string | null
          discount_percent: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          meta_description_kz: string | null
          meta_description_ru: string | null
          meta_title_kz: string | null
          meta_title_ru: string | null
          slug: string
          sort_order: number | null
          title_kz: string | null
          title_ru: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          description_kz?: string | null
          description_ru?: string | null
          discount_percent?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          slug: string
          sort_order?: number | null
          title_kz?: string | null
          title_ru: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          description_kz?: string | null
          description_ru?: string | null
          discount_percent?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          slug?: string
          sort_order?: number | null
          title_kz?: string | null
          title_ru?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      steel_grades: {
        Row: {
          applications_kz: string | null
          applications_ru: string | null
          chemical_composition: Json | null
          created_at: string | null
          description_kz: string | null
          description_ru: string | null
          gost_id: string | null
          id: string
          is_active: boolean | null
          mechanical_properties: Json | null
          meta_description_kz: string | null
          meta_description_ru: string | null
          meta_title_kz: string | null
          meta_title_ru: string | null
          name: string
          slug: string
        }
        Insert: {
          applications_kz?: string | null
          applications_ru?: string | null
          chemical_composition?: Json | null
          created_at?: string | null
          description_kz?: string | null
          description_ru?: string | null
          gost_id?: string | null
          id?: string
          is_active?: boolean | null
          mechanical_properties?: Json | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          name: string
          slug: string
        }
        Update: {
          applications_kz?: string | null
          applications_ru?: string | null
          chemical_composition?: Json | null
          created_at?: string | null
          description_kz?: string | null
          description_ru?: string | null
          gost_id?: string | null
          id?: string
          is_active?: boolean | null
          mechanical_properties?: Json | null
          meta_description_kz?: string | null
          meta_description_ru?: string | null
          meta_title_kz?: string | null
          meta_title_ru?: string | null
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "steel_grades_gost_id_fkey"
            columns: ["gost_id"]
            isOneToOne: false
            referencedRelation: "gost_standards"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
