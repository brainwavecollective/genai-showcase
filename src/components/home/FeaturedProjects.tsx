
import { useState, useEffect } from 'react';
import { Project } from '@/types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface FeaturedProjectsProps {
  projects: Project[];
  isLoading: boolean;
}

export function FeaturedProjects({ projects, isLoading }: FeaturedProjectsProps) {
  const navigate = useNavigate();
  const featuredProjects = projects
    .filter(project => !project.is_private)
    .sort(() => 0.5 - Math.random()) // Simple randomization
    .slice(0, 5); // Take top 5 projects
    
  if (isLoading || featuredProjects.length === 0) return null;

  return (
    <div className="py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Featured Projects</h2>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent>
          {featuredProjects.map((project) => (
            <CarouselItem key={project.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card 
                  className="overflow-hidden cursor-pointer group"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    {project.cover_image_url ? (
                      <img 
                        src={project.cover_image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 w-full">
                        <Badge className="bg-primary text-primary-foreground mb-2">Featured</Badge>
                        <h3 className="text-lg font-bold text-white truncate">{project.title}</h3>
                        <p className="text-sm text-white/80">By {project.creator_name}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 bg-background border shadow-sm" />
        <CarouselNext className="-right-4 bg-background border shadow-sm" />
      </Carousel>
    </div>
  );
}
