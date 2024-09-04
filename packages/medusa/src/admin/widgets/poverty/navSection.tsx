import {
  DragDropContext,
  Droppable,
  Draggable,
} from '@hello-pangea/dnd';
import {
  PlusMini
} from '@medusajs/icons';
import {
  Input,
  Text,
  Button,
  IconButton,
  Drawer,
  Heading,
  Table,
  Label,
} from '@medusajs/ui';
import { useState } from 'react';

const NavSection = () => {
  const [pageName, setPageName] = useState<string>();
  const [pageSlug, setPageSlug] = useState<string>();
  return (
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
  );
}