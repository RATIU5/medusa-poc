import { defineRouteConfig } from '@medusajs/admin-shared';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
  type ResponderProvided,
} from '@hello-pangea/dnd';
import {
  ChatBubbleLeftRight,
  DotsSix,
  EllipsisHorizontal,
  PlusMini,
} from '@medusajs/icons';
import {
  Container,
  Tabs,
  Input,
  Text,
  Button,
  IconButton,
  Drawer,
  Heading,
  Table,
  Label,
} from '@medusajs/ui';
import React, { useState } from 'react';

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

const CustomPage = () => {
  const [mainItems, setMainItems] = useState<Item[]>([]);
  const [footerItems, setFooterItems] = useState<Item[]>([]);
  const [pageName, setPageName] = useState<string>();
  const [pageSlug, setPageSlug] = useState<string>();

  function handleDragEndMain(result: DropResult, provided: ResponderProvided) {
    if (!result.destination) return;

    const newMainItems = Array.from(mainItems);
    const [reorderedMainItem] = newMainItems.splice(result.source.index, 1);
    newMainItems.splice(result.destination.index, 0, reorderedMainItem);
    setMainItems(newMainItems);
  }

  function handlePageNameChange(event) {
    setPageName(event.target.value);
  }
  function handleSlugNameChange(event) {
    setPageSlug(event.target.value);
  }
  async function handleNewHeaderLinkSubmit() {
    const payload: NewNavItemPayload = {
      title: pageName + pageSlug,
      metadata: {
        position: mainItems.length + 1,
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

  function handleDragEndFooter(
    result: DropResult,
    provided: ResponderProvided
  ) {
    if (!result.destination) return;

    const newFooterItems = Array.from(footerItems);
    const [reorderedFooterItem] = newFooterItems.splice(result.source.index, 1);
    newFooterItems.splice(result.destination.index, 0, reorderedFooterItem);
    setFooterItems(newFooterItems);
  }

  return (
    <Container className="p-0">
      <div className="w-full">
        <Tabs defaultValue="general">
          <Tabs.List className="px-6 py-4">
            <Tabs.Trigger value="general">General</Tabs.Trigger>
            <Tabs.Trigger value="media">Media</Tabs.Trigger>
            <Tabs.Trigger value="hero">Home Hero</Tabs.Trigger>
          </Tabs.List>
          <div>
            <Tabs.Content value="general">
              <div className="pb-4">
                <div className="flex justify-between px-6 py-4">
                  <Heading level="h1">Main Navigational Links</Heading>
                  <Drawer>
                    <Drawer.Trigger asChild>
                      <IconButton>
                        <PlusMini />
                      </IconButton>
                    </Drawer.Trigger>
                    <Drawer.Content>
                      <Drawer.Header>
                        <Drawer.Title>Add Main Page Name & Slug</Drawer.Title>
                      </Drawer.Header>
                      <Drawer.Body className="p-4">
                        <Text>
                          This is where you add a new Main Page Name & Slug
                        </Text>
                        <div className="w-[250px]">
                          <Label>Page Name</Label>
                          <Input
                            placeholder="Mattresses"
                            id="pageName"
                            value={pageName}
                            onChange={handlePageNameChange}
                          />
                        </div>
                        <div className="w-[250px]">
                          <Label>Page Slug</Label>
                          <Input
                            placeholder="/mattresses"
                            id="pageSlug"
                            value={pageSlug}
                            onChange={handleSlugNameChange}
                          />
                        </div>
                      </Drawer.Body>
                      <Drawer.Footer>
                        <Drawer.Close asChild>
                          <Button variant="secondary">Cancel</Button>
                        </Drawer.Close>
                        <Button onClick={handleNewHeaderLinkSubmit}>
                          Save
                        </Button>
                      </Drawer.Footer>
                    </Drawer.Content>
                  </Drawer>
                </div>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell />
                      <Table.HeaderCell>Page Title</Table.HeaderCell>
                      <Table.HeaderCell>Page Slug</Table.HeaderCell>
                      <Table.HeaderCell className="text-right" />
                      <Table.HeaderCell />
                    </Table.Row>
                  </Table.Header>
                  <DragDropContext onDragEnd={handleDragEndMain}>
                    <Droppable droppableId="items">
                      {(provided) => (
                        <Table.Body
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {mainItems.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id.toString()}
                              index={index}
                            >
                              {(provided) => (
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
                                          <Drawer.Title>
                                            Edit Page Name & Slug
                                          </Drawer.Title>
                                        </Drawer.Header>
                                        <Drawer.Body className="p-4">
                                          <Text>
                                            This is where you edit the Page Name
                                            & Slug details
                                          </Text>
                                        </Drawer.Body>
                                        <Drawer.Footer>
                                          <Drawer.Close asChild>
                                            <Button variant="secondary">
                                              Cancel
                                            </Button>
                                          </Drawer.Close>
                                          <Button>Save</Button>
                                        </Drawer.Footer>
                                      </Drawer.Content>
                                    </Drawer>
                                  </Table.Cell>
                                </Table.Row>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </Table.Body>
                      )}
                    </Droppable>
                  </DragDropContext>
                </Table>
              </div>

              <div>
                <div className="flex justify-between px-6 py-4">
                  <Heading level="h2">Footer Navigational Links</Heading>
                  <Drawer>
                    <Drawer.Trigger asChild>
                      <IconButton>
                        <PlusMini />
                      </IconButton>
                    </Drawer.Trigger>
                    <Drawer.Content>
                      <Drawer.Header>
                        <Drawer.Title>Add Footer Page Name & Slug</Drawer.Title>
                      </Drawer.Header>
                      <Drawer.Body className="p-4">
                        <Text>
                          This is where you add a new Footer Page Name & Slug
                        </Text>
                      </Drawer.Body>
                      <Drawer.Footer>
                        <Drawer.Close asChild>
                          <Button variant="secondary">Cancel</Button>
                        </Drawer.Close>
                        <Button>Save</Button>
                      </Drawer.Footer>
                    </Drawer.Content>
                  </Drawer>
                </div>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell />
                      <Table.HeaderCell>Page Title</Table.HeaderCell>
                      <Table.HeaderCell>Page Slug</Table.HeaderCell>
                      <Table.HeaderCell className="text-right" />
                      <Table.HeaderCell />
                    </Table.Row>
                  </Table.Header>
                  <DragDropContext onDragEnd={handleDragEndFooter}>
                    <Droppable droppableId="items">
                      {(provided) => (
                        <Table.Body
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {footerItems.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id.toString()}
                              index={index}
                            >
                              {(provided) => (
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
                                          <Drawer.Title>
                                            Edit Page Name & Slug
                                          </Drawer.Title>
                                        </Drawer.Header>
                                        <Drawer.Body className="p-4">
                                          <Text>
                                            This is where you edit the Page Name
                                            & Slug details
                                          </Text>
                                        </Drawer.Body>
                                        <Drawer.Footer>
                                          <Drawer.Close asChild>
                                            <Button variant="secondary">
                                              Cancel
                                            </Button>
                                          </Drawer.Close>
                                          <Button>Save</Button>
                                        </Drawer.Footer>
                                      </Drawer.Content>
                                    </Drawer>
                                  </Table.Cell>
                                </Table.Row>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </Table.Body>
                      )}
                    </Droppable>
                  </DragDropContext>
                </Table>
              </div>
            </Tabs.Content>
            <Tabs.Content value="media">
              <div className="w-[250px]">
                <Input
                  type="file"
                  placeholder="Sales Channel Name"
                  id="sales-channel-name"
                />
              </div>
            </Tabs.Content>
            <Tabs.Content value="hero">
              <Drawer>
                <Drawer.Trigger asChild>
                  <Button>Edit Variant</Button>
                </Drawer.Trigger>
                <Drawer.Content>
                  <Drawer.Header>
                    <Drawer.Title>Edit Variant</Drawer.Title>
                  </Drawer.Header>
                  <Drawer.Body className="p-4">
                    <Text>
                      This is where you edit the variant&apos;s details
                    </Text>
                  </Drawer.Body>
                  <Drawer.Footer>
                    <Drawer.Close asChild>
                      <Button variant="secondary">Cancel</Button>
                    </Drawer.Close>
                    <Button>Save</Button>
                  </Drawer.Footer>
                </Drawer.Content>
              </Drawer>
              <Text size="small">
                Our payment process is designed to make your shopping experience
                smooth and secure. We offer a variety of payment options to
                accommodate your preferences, from credit and debit cards to
                online payment gateways. Rest assured that your financial
                information is protected through advanced encryption methods.
                Shopping with us means you can shop with confidence, knowing
                your payments are safe and hassle-free.
              </Text>
            </Tabs.Content>
          </div>
        </Tabs>
      </div>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: 'Poverty CMS',

  icon: ChatBubbleLeftRight,
});

export default CustomPage;
