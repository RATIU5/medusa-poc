import { DotsSix, EllipsisHorizontal } from '@medusajs/icons';
import { Text, Button, IconButton, Drawer, Table } from '@medusajs/ui';
import { useState } from 'react';

type Item = {
  id: number;
  title: string;
  content: {
    slug: string;
  };
};

type NewNavItemPayload = {
  title: string;
  metadata: {
    position: number;
    type: 'header-link' | 'footer-link';
  };
  content: {
    name: string;
    slug: string;
  };
};
type NewNavItemResponse = {
  data: {
    id: string;
    title: string;
    metadata: {
      position: number;
      type: 'header-link' | 'footer-link';
    };
    content: {
      name: string;
      slug: string;
    };
    parent_id: string;
    created_at: string;
    updated_at: string;
  } | null;
};

const NavItem = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [pageName, setPageName] = useState<string>();
  const [pageSlug, setPageSlug] = useState<string>();

  async function handleNewHeaderLinkSubmit() {
    const payload: NewNavItemPayload = {
      title: pageName + pageSlug,
      metadata: {
        position: items.length + 1,
        type: 'header-link',
      },
      content: {
        name: pageName,
        slug: pageSlug,
      },
    };
    const res = await fetch('/admin/poverty/navigation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as NewNavItemResponse;
    console.log(data);
  }

  return (
    <Table.Row
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      className="[&_td:last-child]:w-[1%] [&_td:last-child]:whitespace-nowrap h-[50px]"
    >
      <Table.Cell>
        <IconButton variant="transparent">
          <DotsSix />
        </IconButton>
      </Table.Cell>
      <Table.Cell>{item.title}</Table.Cell>
      <Table.Cell>{item.content.slug}</Table.Cell>
      <Table.Cell className="text-right">
        <Drawer>
          <Drawer.Trigger asChild>
            <IconButton variant="transparent">
              <EllipsisHorizontal />
            </IconButton>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Edit Page Name & Slug</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="p-4">
              <Text>This is where you edit the Page Name & Slug details</Text>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close asChild>
                <Button variant="secondary">Cancel</Button>
              </Drawer.Close>
              <Button>Save</Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      </Table.Cell>
    </Table.Row>
  );
};

export default NavItem;
