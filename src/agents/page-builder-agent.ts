/**
 * Page Builder Agent - ページビルダーエージェント
 */

import { BaseAgent, AgentConfig, AgentContext, AgentResult, createConsoleLogger } from './base-agent';

// コンポーネントタイプ
export type ComponentType =
  | 'section'
  | 'container'
  | 'hero'
  | 'headline'
  | 'subheadline'
  | 'text'
  | 'image'
  | 'video'
  | 'button'
  | 'form'
  | 'testimonial'
  | 'pricing'
  | 'faq'
  | 'countdown'
  | 'guarantee'
  | 'social_proof'
  | 'features'
  | 'benefits'
  | 'comparison'
  | 'footer';

// ページコンポーネント
export interface PageComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  styles: {
    className?: string;
    css?: Record<string, string>;
  };
  children?: PageComponent[];
}

// ページ設定
export interface PageConfig {
  id: string;
  funnelId: string;
  name: string;
  slug: string;
  type: 'landing' | 'sales' | 'checkout' | 'upsell' | 'downsell' | 'thankyou' | 'webinar' | 'member';
  components: PageComponent[];
  seo: {
    title: string;
    description: string;
    keywords?: string[];
    ogImage?: string;
  };
  settings: {
    template?: string;
    customCSS?: string;
    customJS?: string;
    tracking?: {
      googleAnalytics?: string;
      facebookPixel?: string;
    };
  };
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ページテンプレート
export interface PageTemplate {
  id: string;
  name: string;
  type: PageConfig['type'];
  thumbnail?: string;
  components: Omit<PageComponent, 'id'>[];
}

// 入力パラメータ
export interface PageBuilderInput {
  action: 'create' | 'update' | 'delete' | 'get' | 'list' | 'add_component' | 'remove_component' | 'update_component' | 'publish';
  pageId?: string;
  funnelId?: string;
  data?: Partial<PageConfig>;
  templateId?: string;
  component?: Partial<PageComponent>;
  componentId?: string;
}

// デフォルトテンプレート
const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: 'landing_simple',
    name: 'シンプルランディングページ',
    type: 'landing',
    components: [
      {
        type: 'hero',
        props: {
          headline: 'あなたの見出しをここに',
          subheadline: '副見出しで詳細を説明',
          image: 'https://via.placeholder.com/1200x600',
          ctaText: '今すぐ登録',
          ctaLink: '#form',
        },
        styles: { className: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20' },
      },
      {
        type: 'form',
        props: {
          fields: [
            { name: 'name', label: '名前', type: 'text', required: true },
            { name: 'email', label: 'メールアドレス', type: 'email', required: true },
          ],
          submitText: '無料で受け取る',
          privacyText: 'プライバシーポリシーに同意します',
        },
        styles: { className: 'max-w-md mx-auto p-8' },
      },
    ],
  },
  {
    id: 'sales_vsl',
    name: 'VSLセールスページ',
    type: 'sales',
    components: [
      {
        type: 'headline',
        props: { text: '最後のチャンスです', level: 1 },
        styles: { className: 'text-4xl font-bold text-center my-8' },
      },
      {
        type: 'video',
        props: {
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          autoplay: false,
          controls: true,
        },
        styles: { className: 'max-w-4xl mx-auto' },
      },
      {
        type: 'pricing',
        props: {
          plans: [
            {
              name: 'ベーシック',
              price: '¥29,800',
              features: ['機能1', '機能2', '機能3'],
              cta: '今すぐ購入',
            },
          ],
        },
        styles: { className: 'my-12' },
      },
      {
        type: 'button',
        props: {
          text: '今すぐ申し込む',
          link: '#checkout',
          variant: 'primary',
          size: 'large',
        },
        styles: { className: 'block mx-auto' },
      },
    ],
  },
];

export class PageBuilderAgent extends BaseAgent {
  private pages: Map<string, PageConfig> = new Map();
  private componentIdCounter = 0;

  constructor(context: AgentContext) {
    super(
      {
        name: 'PageBuilderAgent',
        description: 'ページビルダーエージェント',
        version: '1.0.0',
      },
      context
    );
  }

  async execute(input: PageBuilderInput): Promise<AgentResult<PageConfig | PageConfig[] | null>> {
    this.log('info', `Executing action: ${input.action}`);

    try {
      switch (input.action) {
        case 'create':
          return this.createPage(input);
        case 'update':
          return this.updatePage(input);
        case 'delete':
          return this.deletePage(input);
        case 'get':
          return this.getPage(input);
        case 'list':
          return this.listPages(input);
        case 'add_component':
          return this.addComponent(input);
        case 'remove_component':
          return this.removeComponent(input);
        case 'update_component':
          return this.updateComponent(input);
        case 'publish':
          return this.publishPage(input);
        default:
          throw new Error(`Unknown action: ${input.action}`);
      }
    } catch (error) {
      this.log('error', `Error executing action: ${error}`);
      return {
        success: false,
        error: error as Error,
        logs: [`Error: ${error}`],
      };
    }
  }

  private async createPage(input: PageBuilderInput): Promise<AgentResult<PageConfig>> {
    const { funnelId, data, templateId } = input;

    if (!funnelId) {
      throw new Error('funnelId is required');
    }

    let components: PageComponent[] = [];

    // テンプレートから取得
    if (templateId) {
      const template = PAGE_TEMPLATES.find(t => t.id === templateId);
      if (template) {
        components = template.components.map(comp => this.assignId(comp));
      }
    }

    const page: PageConfig = {
      id: `page_${Date.now()}`,
      funnelId,
      name: data?.name || 'New Page',
      slug: data?.slug || `page-${Date.now()}`,
      type: data?.type || 'landing',
      components: data?.components || components,
      seo: data?.seo || {
        title: data?.name || 'New Page',
        description: '',
      },
      settings: data?.settings || {},
      published: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.pages.set(page.id, page);

    this.log('info', `Created page: ${page.name} (${page.id})`);

    return {
      success: true,
      data: page,
      logs: [`Created page: ${page.name}`],
    };
  }

  private async updatePage(input: PageBuilderInput): Promise<AgentResult<PageConfig>> {
    const { pageId, data } = input;

    if (!pageId) {
      throw new Error('pageId is required');
    }

    const existing = this.pages.get(pageId);
    if (!existing) {
      throw new Error(`Page not found: ${pageId}`);
    }

    const updated: PageConfig = {
      ...existing,
      ...data,
      id: pageId,
      updatedAt: new Date(),
    };

    this.pages.set(pageId, updated);

    this.log('info', `Updated page: ${updated.name}`);

    return {
      success: true,
      data: updated,
      logs: [`Updated page: ${updated.name}`],
    };
  }

  private async deletePage(input: PageBuilderInput): Promise<AgentResult<null>> {
    const { pageId } = input;

    if (!pageId) {
      throw new Error('pageId is required');
    }

    const deleted = this.pages.delete(pageId);

    if (!deleted) {
      throw new Error(`Page not found: ${pageId}`);
    }

    this.log('info', `Deleted page: ${pageId}`);

    return {
      success: true,
      data: null,
      logs: [`Deleted page: ${pageId}`],
    };
  }

  private async getPage(input: PageBuilderInput): Promise<AgentResult<PageConfig | null>> {
    const { pageId } = input;

    if (!pageId) {
      throw new Error('pageId is required');
    }

    const page = this.pages.get(pageId);

    return {
      success: true,
      data: page || null,
      logs: [page ? `Found page: ${page.name}` : `Page not found: ${pageId}`],
    };
  }

  private async listPages(input: PageBuilderInput): Promise<AgentResult<PageConfig[]>> {
    const { funnelId } = input;

    let pages = Array.from(this.pages.values());

    if (funnelId) {
      pages = pages.filter(p => p.funnelId === funnelId);
    }

    return {
      success: true,
      data: pages,
      logs: [`Listed ${pages.length} pages`],
    };
  }

  private async addComponent(input: PageBuilderInput): Promise<AgentResult<PageConfig>> {
    const { pageId, component } = input;

    if (!pageId || !component) {
      throw new Error('pageId and component are required');
    }

    const page = this.pages.get(pageId);
    if (!page) {
      throw new Error(`Page not found: ${pageId}`);
    }

    const newComponent: PageComponent = this.assignId({
      type: component.type || 'text',
      props: component.props || {},
      styles: component.styles || {},
      children: component.children,
    });

    page.components.push(newComponent);
    page.updatedAt = new Date();

    this.log('info', `Added component ${newComponent.type} to page ${page.name}`);

    return {
      success: true,
      data: page,
      logs: [`Added component: ${newComponent.type}`],
    };
  }

  private async removeComponent(input: PageBuilderInput): Promise<AgentResult<PageConfig>> {
    const { pageId, componentId } = input;

    if (!pageId || !componentId) {
      throw new Error('pageId and componentId are required');
    }

    const page = this.pages.get(pageId);
    if (!page) {
      throw new Error(`Page not found: ${pageId}`);
    }

    const index = page.components.findIndex(c => c.id === componentId);
    if (index === -1) {
      throw new Error(`Component not found: ${componentId}`);
    }

    const removed = page.components.splice(index, 1)[0];
    page.updatedAt = new Date();

    this.log('info', `Removed component ${removed.type} from page ${page.name}`);

    return {
      success: true,
      data: page,
      logs: [`Removed component: ${removed.type}`],
    };
  }

  private async updateComponent(input: PageBuilderInput): Promise<AgentResult<PageConfig>> {
    const { pageId, componentId, component } = input;

    if (!pageId || !componentId || !component) {
      throw new Error('pageId, componentId, and component are required');
    }

    const page = this.pages.get(pageId);
    if (!page) {
      throw new Error(`Page not found: ${pageId}`);
    }

    const index = page.components.findIndex(c => c.id === componentId);
    if (index === -1) {
      throw new Error(`Component not found: ${componentId}`);
    }

    page.components[index] = {
      ...page.components[index],
      ...component,
      id: componentId,
    };
    page.updatedAt = new Date();

    this.log('info', `Updated component ${componentId} in page ${page.name}`);

    return {
      success: true,
      data: page,
      logs: [`Updated component: ${componentId}`],
    };
  }

  private async publishPage(input: PageBuilderInput): Promise<AgentResult<PageConfig>> {
    const { pageId } = input;

    if (!pageId) {
      throw new Error('pageId is required');
    }

    const page = this.pages.get(pageId);
    if (!page) {
      throw new Error(`Page not found: ${pageId}`);
    }

    page.published = true;
    page.updatedAt = new Date();

    this.log('info', `Published page: ${page.name}`);

    return {
      success: true,
      data: page,
      logs: [`Published page: ${page.name}`],
    };
  }

  private assignId(component: Omit<PageComponent, 'id'>): PageComponent {
    return {
      ...component,
      id: `comp_${Date.now()}_${this.componentIdCounter++}`,
      children: component.children?.map(child => this.assignId(child)),
    };
  }

  static getTemplates(): PageTemplate[] {
    return PAGE_TEMPLATES;
  }
}

export const createPageBuilderAgent = (projectRoot: string): PageBuilderAgent => {
  return new PageBuilderAgent({
    projectRoot,
    config: {},
    logger: createConsoleLogger(),
  });
};
