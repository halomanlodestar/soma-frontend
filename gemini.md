<!-- @format -->

# Rules

DO NOT CREATE A COMPONENT IF ITS AVAILABLE IN SHADCN. JUST INSTALL COMPONENTS. for now, if u ever need to have placeholder data,
just make a hook for it, for example for a /feed page, make a useFeed() hook and put placeholder data in it. ensure we dont clutter data stuff into UI.

always use proper typing, avoid using ANY whenever possible.
we always want to seperate data code, logic code and ui code. if a component gets too big, just break it into smaller ones ONLY IF IT FOLLOWS THE FUNDAMENTAL ENGINEERING COUPLING RULES.
